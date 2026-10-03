import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";

import {
  discoverSFDXProject,
  SFDXProject,
} from "./project-discovery";

export interface ZIPIngestionResult {
  extractionPath: string;
  project: SFDXProject;
  files: string[];
}

/**
 * Safely extracts an SFDX ZIP and discovers the project.
 */
export function ingestSFDXZip(
  zipPath: string,
  outputDirectory: string
): ZIPIngestionResult {
  if (!fs.existsSync(zipPath)) {
    throw new Error(`ZIP file not found: ${zipPath}`);
  }

  if (!zipPath.toLowerCase().endsWith(".zip")) {
    throw new Error("Only .zip files are supported.");
  }

  const extractionPath = path.resolve(
    outputDirectory,
    `project-${Date.now()}`
  );

  fs.mkdirSync(extractionPath, {
    recursive: true,
  });

  const zip = new AdmZip(zipPath);

  const entries = zip.getEntries();

  for (const entry of entries) {
    const entryName = entry.entryName;

    /*
     * Prevent Zip Slip attacks.
     *
     * A malicious ZIP could contain:
     *
     * ../../some-file
     *
     * and attempt to write outside our extraction directory.
     */
    const targetPath = path.resolve(
      extractionPath,
      entryName
    );

    if (
      !targetPath.startsWith(
        extractionPath + path.sep
      )
    ) {
      throw new Error(
        `Unsafe ZIP entry detected: ${entryName}`
      );
    }
  }

  zip.extractAllTo(
    extractionPath,
    true
  );

  /*
   * Some ZIPs contain:
   *
   * project.zip
   * └── my-salesforce-project/
   *     ├── sfdx-project.json
   *
   * while others contain:
   *
   * project.zip
   * ├── sfdx-project.json
   * └── force-app/
   *
   * We support both.
   */
  const projectRoot =
    findSFDXProjectRoot(extractionPath);

  if (!projectRoot) {
    throw new Error(
      "No sfdx-project.json found inside the ZIP."
    );
  }

  const project =
    discoverSFDXProject(projectRoot);

  const files =
    collectFiles(projectRoot);

  return {
    extractionPath: projectRoot,
    project,
    files,
  };
}

/**
 * Finds the directory containing sfdx-project.json.
 */
function findSFDXProjectRoot(
  directory: string
): string | null {
  const configPath = path.join(
    directory,
    "sfdx-project.json"
  );

  if (fs.existsSync(configPath)) {
    return directory;
  }

  const entries = fs.readdirSync(
    directory,
    {
      withFileTypes: true,
    }
  );

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const childPath = path.join(
      directory,
      entry.name
    );

    const result =
      findSFDXProjectRoot(childPath);

    if (result) {
      return result;
    }
  }

  return null;
}

/**
 * Collects all files in the discovered project.
 */
function collectFiles(
  directory: string
): string[] {
  const entries = fs.readdirSync(
    directory,
    {
      withFileTypes: true,
    }
  );

  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(
      directory,
      entry.name
    );

    if (entry.isDirectory()) {
      files.push(
        ...collectFiles(fullPath)
      );
    } else {
      files.push(fullPath);
    }
  }

  return files;
}