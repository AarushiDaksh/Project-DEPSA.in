
import fs from "fs";
import path from "path";

import {
  DEPSAProject,
  SalesforceComponent,
  SalesforceComponentType,
} from "@/types/DePSA";

/**
 * Recursively gets every file inside a directory.
 */
function getFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) {
    return [];
  }

  const entries = fs.readdirSync(directory, {
    withFileTypes: true,
  });

  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...getFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Detects the Salesforce metadata type from its path.
 */
function detectComponentType(
  filePath: string
): SalesforceComponentType | null {
  const normalizedPath = filePath.replace(/\\/g, "/");

  if (
    normalizedPath.includes("/classes/") &&
    filePath.endsWith(".cls")
  ) {
    return "ApexClass";
  }

  if (
    normalizedPath.includes("/triggers/") &&
    filePath.endsWith(".trigger")
  ) {
    return "ApexTrigger";
  }

  if (normalizedPath.includes("/lwc/")) {
    return "LWC";
  }

  if (normalizedPath.includes("/aura/")) {
    return "Aura";
  }

  if (
    normalizedPath.includes("/objects/") &&
    filePath.endsWith(".object-meta.xml")
  ) {
    return "CustomObject";
  }

  if (
    normalizedPath.includes("/flows/") &&
    filePath.endsWith(".flow-meta.xml")
  ) {
    return "Flow";
  }

  if (
    normalizedPath.includes("/permissionsets/") &&
    filePath.endsWith(".permissionset-meta.xml")
  ) {
    return "PermissionSet";
  }

  if (
    normalizedPath.includes("/profiles/") &&
    filePath.endsWith(".profile-meta.xml")
  ) {
    return "Profile";
  }

  if (normalizedPath.includes("/experiences/")) {
    return "ExperienceBundle";
  }

  if (normalizedPath.includes("/customMetadata/")) {
    return "CustomMetadata";
  }

  if (
    normalizedPath.includes("/labels/") &&
    filePath.endsWith(".labels-meta.xml")
  ) {
    return "CustomLabel";
  }

  return null;
}

/**
 * Gets a clean Salesforce component name.
 */
function getComponentName(
  filePath: string,
  type: SalesforceComponentType
): string {
  const fileName = path.basename(filePath);

  // LWC:
  // lwc/myComponent/myComponent.js
  if (type === "LWC") {
    return path.basename(path.dirname(filePath));
  }

  // Aura:
  // aura/myComponent/myComponent.cmp
  if (type === "Aura") {
    return path.basename(path.dirname(filePath));
  }

  return fileName
    .replace(".cls", "")
    .replace(".trigger", "")
    .replace(".object-meta.xml", "")
    .replace(".flow-meta.xml", "")
    .replace(".permissionset-meta.xml", "")
    .replace(".profile-meta.xml", "")
    .replace(".labels-meta.xml", "")
    .replace(".xml", "");
}

/**
 * Creates a normalized DEPSA component.
 */
function createComponent(
  filePath: string,
  projectRoot: string,
  type: SalesforceComponentType
): SalesforceComponent {
  const name = getComponentName(filePath, type);

  const relativePath = path
    .relative(projectRoot, filePath)
    .replace(/\\/g, "/");

  return {
    id: `${type}:${name}`,
    name,
    type,
    path: relativePath,
  };
}

/**
 * Parses an SFDX Salesforce project.
 *
 * V0.1 responsibility:
 * - Validate SFDX project
 * - Scan force-app
 * - Detect Salesforce components
 * - Return normalized DEPSA project
 */
export function parseSalesforceProject(
  projectPath: string
): DEPSAProject {
  const projectRoot = path.resolve(projectPath);

  if (!fs.existsSync(projectRoot)) {
    throw new Error(`Project not found: ${projectRoot}`);
  }

  const projectConfigPath = path.join(
    projectRoot,
    "sfdx-project.json"
  );

  if (!fs.existsSync(projectConfigPath)) {
    throw new Error(
      "Invalid Salesforce project: sfdx-project.json not found."
    );
  }

  const sourceDirectory = path.join(
    projectRoot,
    "force-app",
    "main",
    "default"
  );

  if (!fs.existsSync(sourceDirectory)) {
    throw new Error(
      "Salesforce source directory not found: force-app/main/default"
    );
  }

  const files = getFiles(sourceDirectory);

  const components: SalesforceComponent[] = [];

  for (const file of files) {
    const type = detectComponentType(file);

    if (!type) {
      continue;
    }

    const component = createComponent(
      file,
      projectRoot,
      type
    );

    /**
     * LWC and Aura contain multiple files.
     *
     * Example:
     *
     * myComponent.js
     * myComponent.html
     * myComponent.js-meta.xml
     *
     * They represent ONE component.
     */
    if (type === "LWC" || type === "Aura") {
      const exists = components.some(
        (existing) => existing.id === component.id
      );

      if (!exists) {
        components.push(component);
      }

      continue;
    }

    components.push(component);
  }

  let projectName = path.basename(projectRoot);

  try {
    const projectConfig = JSON.parse(
      fs.readFileSync(projectConfigPath, "utf-8")
    );

    if (projectConfig.name) {
      projectName = projectConfig.name;
    }
  } catch {
    console.warn(
      "DEPSA: Could not parse sfdx-project.json"
    );
  }

  return {
    name: projectName,
    rootPath: projectRoot,

    components,

    // Dependencies will be populated by the resolver.
    dependencies: [],

    statistics: {
      totalComponents: components.length,

      totalDependencies: 0,

      apexClasses: components.filter(
        (component) =>
          component.type === "ApexClass"
      ).length,

      triggers: components.filter(
        (component) =>
          component.type === "ApexTrigger"
      ).length,

      lwcComponents: components.filter(
        (component) =>
          component.type === "LWC"
      ).length,

      objects: components.filter(
        (component) =>
          component.type === "CustomObject"
      ).length,
    },
  };
}

