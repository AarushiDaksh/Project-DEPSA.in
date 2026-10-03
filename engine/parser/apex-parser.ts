import fs from "fs";

export interface ApexMethod {
  name: string;
  visibility?: string;
  returnType?: string;
  parameters?: string[];
  startLine: number;
}

export interface ApexReference {
  target: string;
  type:
    | "CLASS"
    | "OBJECT"
    | "FIELD"
    | "METHOD"
    | "DML";
  operation?: string;
  line: number;
  evidence: string;
  confidence: number;
}

export interface ParsedApexClass {
  name: string;
  path: string;
  extends?: string;
  implements: string[];
  methods: ApexMethod[];
  references: ApexReference[];
}

/**
 * Parse an Apex class file.
 *
 * V0.1 focuses on high-confidence signals:
 *
 * - class name
 * - extends
 * - implements
 * - methods
 * - SOQL objects
 * - SOQL fields
 * - DML operations
 * - referenced Apex classes
 */
export function parseApexFile(
  filePath: string
): ParsedApexClass {
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `Apex file not found: ${filePath}`
    );
  }

  const source = fs.readFileSync(
    filePath,
    "utf-8"
  );

  return parseApexSource(
    source,
    filePath
  );
}

/**
 * Parse Apex source text.
 */
export function parseApexSource(
  source: string,
  filePath = "unknown.cls"
): ParsedApexClass {
  const cleanSource =
    removeComments(source);

  const classInfo =
    extractClassInfo(cleanSource);

  const methods =
    extractMethods(cleanSource);

  const references =
    extractReferences(cleanSource);

  return {
    name: classInfo.name,
    path: filePath,
    extends: classInfo.extends,
    implements: classInfo.implements,
    methods,
    references,
  };
}

/**
 * Remove // and /* *\/ comments while
 * preserving line positions.
 */
function removeComments(
  source: string
): string {
  return source
    .replace(
      /\/\*[\s\S]*?\*\//g,
      (match) =>
        match.replace(/[^\n]/g, " ")
    )
    .replace(
      /\/\/.*$/gm,
      ""
    );
}

/**
 * Extract class declaration.
 */
function extractClassInfo(
  source: string
): {
  name: string;
  extends?: string;
  implements: string[];
} {
  const match = source.match(
    /\bclass\s+([A-Za-z_][A-Za-z0-9_]*)(?:\s+extends\s+([A-Za-z_][A-Za-z0-9_]*))?(?:\s+implements\s+([^{]+))?/m
  );

  if (!match) {
    return {
      name: "UnknownApexClass",
      implements: [],
    };
  }

  const implementsList =
    match[3]
      ?.split(",")
      .map((item) => item.trim())
      .filter(Boolean) ?? [];

  return {
    name: match[1],
    extends: match[2],
    implements: implementsList,
  };
}

/**
 * Extract method declarations.
 */
function extractMethods(
  source: string
): ApexMethod[] {
  const methods: ApexMethod[] = [];

  /*
   * This intentionally supports common Apex
   * method declarations rather than attempting
   * to be a complete Apex grammar.
   */
  const methodRegex =
    /(?:(public|private|protected|global|webservice)\s+)?(?:(static)\s+)?([A-Za-z_][A-Za-z0-9_<>,\[\] ]*)\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(([^)]*)\)\s*(?:throws\s+[^{]+)?\{/gm;

  let match: RegExpExecArray | null;

  while (
    (match = methodRegex.exec(source)) !== null
  ) {
    const before =
      source.slice(0, match.index);

    const startLine =
      before.split("\n").length;

    const parameters =
      match[5]
        ? match[5]
            .split(",")
            .map((parameter) =>
              parameter.trim()
            )
            .filter(Boolean)
        : [];

    methods.push({
      name: match[4],
      visibility: match[1],
      returnType: match[3].trim(),
      parameters,
      startLine,
    });
  }

  return methods;
}

/**
 * Extract Salesforce references.
 */
function extractReferences(
  source: string
): ApexReference[] {
  const references: ApexReference[] = [];

  extractSOQLReferences(
    source,
    references
  );

  extractDMLReferences(
    source,
    references
  );

  extractApexClassReferences(
    source,
    references
  );

  return deduplicateReferences(
    references
  );
}

/**
 * Extract SOQL:
 *
 * SELECT Id, Name
 * FROM Account
 */
function extractSOQLReferences(
  source: string,
  references: ApexReference[]
): void {
  const soqlRegex =
    /\[\s*SELECT\s+([\s\S]*?)\s+FROM\s+([A-Za-z_][A-Za-z0-9_]*)([\s\S]*?)\]/gi;

  let match: RegExpExecArray | null;

  while (
    (match = soqlRegex.exec(source)) !== null
  ) {
    const fieldsText =
      match[1].trim();

    const objectName =
      match[2].trim();

    const line =
      getLineNumber(
        source,
        match.index
      );

    const evidence =
      match[0]
        .replace(/\s+/g, " ")
        .trim();

    references.push({
      target: objectName,
      type: "OBJECT",
      operation: "QUERY",
      line,
      evidence,
      confidence: 0.98,
    });

    const fields =
      extractSOQLFields(fieldsText);

    for (const field of fields) {
      references.push({
        target: `${objectName}.${field}`,
        type: "FIELD",
        operation: "READ",
        line,
        evidence,
        confidence: 0.94,
      });
    }
  }
}

/**
 * Extract fields from SELECT.
 */
function extractSOQLFields(
  fieldsText: string
): string[] {
  return fieldsText
    .split(",")
    .map((field) => field.trim())
    .map((field) => {
      /*
       * Remove aliases/functions where possible.
       */
      const match =
        field.match(
          /^([A-Za-z_][A-Za-z0-9_.]*)/
        );

      return match?.[1] ?? "";
    })
    .filter(Boolean)
    .filter(
      (field) =>
        !field.includes("(")
    );
}

/**
 * Extract DML operations.
 *
 * insert account;
 * update account;
 * delete account;
 * upsert account;
 */
function extractDMLReferences(
  source: string,
  references: ApexReference[]
): void {
  const dmlRegex =
    /\b(insert|update|delete|upsert|undelete)\s+([A-Za-z_][A-Za-z0-9_]*)\s*;/gi;

  let match: RegExpExecArray | null;

  while (
    (match = dmlRegex.exec(source)) !== null
  ) {
    const operation =
      match[1].toUpperCase();

    const variable =
      match[2];

    const line =
      getLineNumber(
        source,
        match.index
      );

    references.push({
      target: variable,
      type: "DML",
      operation,
      line,
      evidence: match[0],
      confidence: 0.97,
    });
  }
}

/**
 * Extract likely Apex class references.
 *
 * Example:
 *
 * AccountService.createAccount(...)
 *
 * becomes:
 *
 * AccountService → METHOD
 */
function extractApexClassReferences(
  source: string,
  references: ApexReference[]
): void {
  const classRegex =
    /\b([A-Z][A-Za-z0-9_]*)\.([a-zA-Z_][A-Za-z0-9_]*)\s*\(/g;

  let match: RegExpExecArray | null;

  while (
    (match = classRegex.exec(source)) !== null
  ) {
    const className =
      match[1];

    const methodName =
      match[2];

    /*
     * Ignore common language/system constructs.
     */
    const ignored = new Set([
      "System",
      "String",
      "Math",
      "Date",
      "Datetime",
      "JSON",
      "Test",
      "Schema",
      "Database",
      "Limits",
      "UserInfo",
    ]);

    if (ignored.has(className)) {
      continue;
    }

    const line =
      getLineNumber(
        source,
        match.index
      );

    references.push({
      target: className,
      type: "CLASS",
      operation: "CALL",
      line,
      evidence: match[0],
      confidence: 0.85,
    });

    references.push({
      target: `${className}.${methodName}`,
      type: "METHOD",
      operation: "CALL",
      line,
      evidence: match[0],
      confidence: 0.9,
    });
  }
}

/**
 * Convert a character position into a line number.
 */
function getLineNumber(
  source: string,
  position: number
): number {
  return (
    source
      .slice(0, position)
      .split("\n").length
  );
}

/**
 * Remove duplicate references while
 * keeping the strongest confidence/evidence.
 */
function deduplicateReferences(
  references: ApexReference[]
): ApexReference[] {
  const map =
    new Map<string, ApexReference>();

  for (const reference of references) {
    const key =
      `${reference.type}:${reference.target}:${reference.operation}`;

    const existing =
      map.get(key);

    if (
      !existing ||
      reference.confidence >
        existing.confidence
    ) {
      map.set(key, reference);
    }
  }

  return Array.from(
    map.values()
  );
}