import fs from "fs";
import path from "path";

import {
  getMetadataDefinition,
} from "../registry/metadata-registry";

import {
  SFDXProject,
} from "./project-discovery";

export interface MetadataComponent {
  id: string;

  name: string;

  type: string;

  path: string;

  packageDirectory: string;

  isBundle: boolean;

  files: string[];

  metadata: {
    extension?: string;
    size?: number;
  };
}

export interface MetadataInventory {
  components: MetadataComponent[];

  statistics: {
    totalComponents: number;
    totalFiles: number;
    componentsByType: Record<string, number>;
  };
}

/**
 * Discovers Salesforce metadata from all package directories
 * defined in sfdx-project.json.
 *
 * This is intentionally an inventory engine.
 *
 * It does NOT try to understand dependencies yet.
 */
export function discoverMetadata(
  project: SFDXProject
): MetadataInventory {
  const components: MetadataComponent[] = [];

  for (const packageDirectory of project.packageDirectories) {
    if (!fs.existsSync(packageDirectory.fullPath)) {
      continue;
    }

    discoverDirectory(
      packageDirectory.fullPath,
      packageDirectory.path,
      packageDirectory.path,
      components
    );
  }

  const componentsByType: Record<
    string,
    number
  > = {};

  for (const component of components) {
    componentsByType[component.type] =
      (componentsByType[component.type] ?? 0) + 1;
  }

  const totalFiles = components.reduce(
    (total, component) =>
      total + component.files.length,
    0
  );

  return {
    components,

    statistics: {
      totalComponents: components.length,
      totalFiles,
      componentsByType,
    },
  };
}

/**
 * Recursively discovers metadata.
 */
function discoverDirectory(
  directory: string,
  packagePath: string,
  relativeDirectory: string,
  components: MetadataComponent[]
): void {
  const entries = fs.readdirSync(
    directory,
    {
      withFileTypes: true,
    }
  );

  for (const entry of entries) {
    const fullPath = path.join(
      directory,
      entry.name
    );

    const relativePath = path
      .join(
        relativeDirectory,
        entry.name
      )
      .replace(/\\/g, "/");

    if (entry.isDirectory()) {
      const metadataType =
        detectDirectoryType(
          relativePath
        );

      if (metadataType) {
        const definition =
          getMetadataDefinition(
            metadataType
          );

        /*
         * Bundles represent one logical
         * Salesforce component containing
         * multiple files.
         */
        if (definition?.bundle) {
          const files =
            collectFiles(fullPath);

          const componentName =
            entry.name;

          components.push({
            id: `${metadataType}:${componentName}`,

            name: componentName,

            type: metadataType,

            path: relativePath,

            packageDirectory: packagePath,

            isBundle: true,

            files,

            metadata: {},
          });

          continue;
        }
      }

      discoverDirectory(
        fullPath,
        packagePath,
        relativePath,
        components
      );

      continue;
    }

    const metadataType =
      detectFileType(relativePath);

    if (!metadataType) {
      continue;
    }

    const componentName =
      getComponentName(
        entry.name,
        metadataType
      );

    const stat =
      fs.statSync(fullPath);

    components.push({
      id: `${metadataType}:${componentName}`,

      name: componentName,

      type: metadataType,

      path: relativePath,

      packageDirectory: packagePath,

      isBundle: false,

      files: [relativePath],

      metadata: {
        extension: path.extname(entry.name),

        size: stat.size,
      },
    });
  }
}

/**
 * Detects metadata from a directory.
 */
function detectDirectoryType(
  relativePath: string
): string | null {
  const parts = relativePath.split("/");

  /*
   * Example:
   *
   * force-app/
   *   main/
   *     default/
   *       lwc/
   *         accountCard/
   *
   * We want the directory directly
   * representing the metadata collection.
   */

  const directoryMappings: Record<
    string,
    string
  > = {
    lwc: "LightningComponentBundle",

    aura: "AuraDefinitionBundle",

    objects: "CustomObject",

    experiences: "ExperienceBundle",

    reports: "Reports",

    dashboards: "Dashboards",

    workflows: "Workflow",
  };

  for (const part of parts) {
    const type =
      directoryMappings[part];

    if (type) {
      return type;
    }
  }

  return null;
}

/**
 * Detects metadata from individual files.
 */
function detectFileType(
  relativePath: string
): string | null {
  const normalized =
    relativePath.replace(/\\/g, "/");

  const fileName =
    path.basename(normalized);

  if (
    normalized.includes("/classes/") &&
    fileName.endsWith(".cls")
  ) {
    return "ApexClass";
  }

  if (
    normalized.includes("/triggers/") &&
    fileName.endsWith(".trigger")
  ) {
    return "ApexTrigger";
  }

  if (
    normalized.includes("/flows/") &&
    fileName.endsWith(".flow-meta.xml")
  ) {
    return "Flow";
  }

  if (
    normalized.includes("/permissionsets/") &&
    fileName.endsWith(
      ".permissionset-meta.xml"
    )
  ) {
    return "PermissionSet";
  }

  if (
    normalized.includes("/profiles/") &&
    fileName.endsWith(".profile-meta.xml")
  ) {
    return "Profile";
  }

  if (
    normalized.includes("/layouts/") &&
    fileName.endsWith(".layout-meta.xml")
  ) {
    return "Layout";
  }

  if (
    normalized.includes("/customMetadata/") &&
    fileName.endsWith(".md-meta.xml")
  ) {
    return "CustomMetadata";
  }

  if (
    normalized.includes("/labels/") &&
    fileName.endsWith(".labels-meta.xml")
  ) {
    return "CustomLabels";
  }

  if (
    normalized.includes(
      "/namedCredentials/"
    )
  ) {
    return "NamedCredential";
  }

  if (
    normalized.includes(
      "/remoteSiteSettings/"
    )
  ) {
    return "RemoteSiteSetting";
  }

  if (
    normalized.includes(
      "/connectedApps/"
    )
  ) {
    return "ConnectedApp";
  }

  if (
    normalized.includes(
      "/customPermissions/"
    )
  ) {
    return "CustomPermission";
  }

  if (
    normalized.includes(
      "/permissionsetgroups/"
    )
  ) {
    return "PermissionSetGroup";
  }

  return null;
}

/**
 * Gets a clean component name.
 */
function getComponentName(
  fileName: string,
  metadataType: string
): string {
  const suffixes = [
    ".cls",
    ".trigger",
    ".flow-meta.xml",
    ".permissionset-meta.xml",
    ".profile-meta.xml",
    ".layout-meta.xml",
    ".md-meta.xml",
    ".labels-meta.xml",
    ".xml",
  ];

  let name = fileName;

  for (const suffix of suffixes) {
    if (name.endsWith(suffix)) {
      name = name.slice(
        0,
        -suffix.length
      );

      break;
    }
  }

  return name;
}

/**
 * Collects all files inside a bundle.
 */
function collectFiles(
  directory: string
): string[] {
  const result: string[] = [];

  const entries = fs.readdirSync(
    directory,
    {
      withFileTypes: true,
    }
  );

  for (const entry of entries) {
    const fullPath = path.join(
      directory,
      entry.name
    );

    if (entry.isDirectory()) {
      result.push(
        ...collectFiles(fullPath)
      );
    } else {
      result.push(
        fullPath.replace(/\\/g, "/")
      );
    }
  }

  return result;
}