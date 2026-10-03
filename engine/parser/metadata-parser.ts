import fs from "fs";
import path from "path";

export interface ParsedMetadata {
  type: string;
  name: string;
  path: string;

  /**
   * Raw metadata content.
   *
   * We keep this because DEPSA should never throw away
   * information just because we don't understand a
   * metadata type yet.
   */
  raw?: string;

  /**
   * Extracted metadata attributes.
   */
  attributes: Record<string, string>;

  /**
   * Child metadata discovered inside this component.
   */
  children: ParsedMetadata[];

  /**
   * References discovered from this metadata.
   *
   * The dependency resolver will turn these into
   * actual graph edges later.
   */
  references: MetadataReference[];
}

export interface MetadataReference {
  target: string;

  type:
    | "FIELD"
    | "OBJECT"
    | "CLASS"
    | "FLOW"
    | "COMPONENT"
    | "METADATA"
    | "UNKNOWN";

  sourceText?: string;

  confidence: number;
}

/**
 * Parse a Salesforce metadata XML file.
 *
 * This parser intentionally starts with generic XML
 * extraction instead of trying to understand every
 * Salesforce metadata type.
 */
export function parseMetadataFile(
  filePath: string
): ParsedMetadata {
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `Metadata file not found: ${filePath}`
    );
  }

  const raw = fs.readFileSync(
    filePath,
    "utf-8"
  );

  const fileName = path.basename(filePath);

  const type = inferMetadataType(
    filePath
  );

  const name = inferMetadataName(
    fileName,
    type
  );

  const attributes =
    extractSimpleElements(raw);

  const references =
    extractReferences(raw);

  return {
    type,
    name,
    path: filePath,
    raw,
    attributes,
    children: [],
    references,
  };
}

/**
 * Attempts to determine the Salesforce metadata
 * type from its path.
 *
 * This is deliberately conservative.
 */
function inferMetadataType(
  filePath: string
): string {
  const normalized =
    filePath.replace(/\\/g, "/");

  if (normalized.includes("/classes/")) {
    return "ApexClass";
  }

  if (normalized.includes("/triggers/")) {
    return "ApexTrigger";
  }

  if (normalized.includes("/lwc/")) {
    return "LightningComponentBundle";
  }

  if (normalized.includes("/aura/")) {
    return "AuraDefinitionBundle";
  }

  if (normalized.includes("/objects/")) {
    return "CustomObject";
  }

  if (normalized.includes("/flows/")) {
    return "Flow";
  }

  if (
    normalized.includes(
      "/permissionsets/"
    )
  ) {
    return "PermissionSet";
  }

  if (normalized.includes("/profiles/")) {
    return "Profile";
  }

  if (normalized.includes("/layouts/")) {
    return "Layout";
  }

  if (
    normalized.includes(
      "/customMetadata/"
    )
  ) {
    return "CustomMetadata";
  }

  if (
    normalized.includes(
      "/experiences/"
    )
  ) {
    return "ExperienceBundle";
  }

  return "UnknownMetadata";
}

/**
 * Extract a clean component name.
 */
function inferMetadataName(
  fileName: string,
  type: string
): string {
  if (
    type === "LightningComponentBundle" ||
    type === "AuraDefinitionBundle"
  ) {
    return path.basename(
      path.dirname(fileName)
    );
  }

  const suffixes = [
    ".cls",
    ".trigger",
    ".object-meta.xml",
    ".flow-meta.xml",
    ".permissionset-meta.xml",
    ".profile-meta.xml",
    ".layout-meta.xml",
    ".md-meta.xml",
    ".labels-meta.xml",
    "-meta.xml",
    ".xml",
  ];

  for (const suffix of suffixes) {
    if (fileName.endsWith(suffix)) {
      return fileName.slice(
        0,
        -suffix.length
      );
    }
  }

  return fileName;
}

/**
 * Extracts simple XML elements.
 *
 * Example:
 *
 * <apiVersion>66.0</apiVersion>
 *
 * becomes:
 *
 * {
 *   apiVersion: "66.0"
 * }
 *
 * This is NOT intended to be a complete XML parser.
 * It is a lightweight first layer.
 */
function extractSimpleElements(
  xml: string
): Record<string, string> {
  const result: Record<
    string,
    string
  > = {};

  const regex =
    /<([A-Za-z0-9_:-]+)>([^<]*)<\/\1>/g;

  let match: RegExpExecArray | null;

  while (
    (match = regex.exec(xml)) !== null
  ) {
    const tag = match[1];
    const value = match[2].trim();

    if (!value) {
      continue;
    }

    /*
     * Don't overwrite repeated XML elements.
     *
     * For repeated values, the first value is kept
     * here. A deeper type-specific parser can later
     * represent arrays correctly.
     */
    if (!(tag in result)) {
      result[tag] = value;
    }
  }

  return result;
}

/**
 * Extract likely Salesforce references from XML.
 *
 * This intentionally produces candidates.
 *
 * The dependency resolver will validate them against
 * the actual component inventory.
 */
function extractReferences(
  xml: string
): MetadataReference[] {
  const references: MetadataReference[] = [];

  /*
   * Object references.
   *
   * Examples:
   *
   * <object>Account</object>
   * <object>Account__c</object>
   */
  const objectRegex =
    /<object>([^<]+)<\/object>/g;

  let match: RegExpExecArray | null;

  while (
    (match = objectRegex.exec(xml)) !== null
  ) {
    references.push({
      target: match[1].trim(),
      type: "OBJECT",
      sourceText: match[0],
      confidence: 0.95,
    });
  }

  /*
   * Field references.
   *
   * Salesforce metadata often contains:
   *
   * <field>Account.Name</field>
   *
   * or:
   *
   * <field>Account__c.Status__c</field>
   */
  const fieldRegex =
    /<field>([^<]+)<\/field>/g;

  while (
    (match = fieldRegex.exec(xml)) !== null
  ) {
    references.push({
      target: match[1].trim(),
      type: "FIELD",
      sourceText: match[0],
      confidence: 0.9,
    });
  }

  /*
   * Apex class references.
   */
  const apexRegex =
    /<apexClass>([^<]+)<\/apexClass>/g;

  while (
    (match = apexRegex.exec(xml)) !== null
  ) {
    references.push({
      target: match[1].trim(),
      type: "CLASS",
      sourceText: match[0],
      confidence: 0.98,
    });
  }

  /*
   * Flow references.
   */
  const flowRegex =
    /<flowName>([^<]+)<\/flowName>/g;

  while (
    (match = flowRegex.exec(xml)) !== null
  ) {
    references.push({
      target: match[1].trim(),
      type: "FLOW",
      sourceText: match[0],
      confidence: 0.95,
    });
  }

  /*
   * Remove duplicate references.
   */
  const unique =
    new Map<string, MetadataReference>();

  for (const reference of references) {
    const key =
      `${reference.type}:${reference.target}`;

    if (!unique.has(key)) {
      unique.set(key, reference);
    }
  }

  return Array.from(
    unique.values()
  );
}