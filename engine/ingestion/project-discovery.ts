import fs from "fs";
import path from "path";

export interface SFDXPackageDirectory {
  path: string;
  fullPath: string;
  default: boolean;
}

export interface SFDXProject {
  name: string;
  apiVersion?: string;
  rootPath: string;
  packageDirectories: SFDXPackageDirectory[];
}

/**
 * Reads and validates sfdx-project.json.
 */
export function discoverSFDXProject(
  projectRoot: string
): SFDXProject {
  const rootPath = path.resolve(projectRoot);

  const configPath = path.join(
    rootPath,
    "sfdx-project.json"
  );

  if (!fs.existsSync(configPath)) {
    throw new Error(
      "sfdx-project.json was not found. This does not appear to be an SFDX project."
    );
  }

  const raw = fs.readFileSync(
    configPath,
    "utf-8"
  );

  let config: {
    name?: string;
    packageDirectories?: Array<{
      path: string;
      default?: boolean;
    }>;
    sourceApiVersion?: string;
  };

  try {
    config = JSON.parse(raw);
  } catch {
    throw new Error(
      "sfdx-project.json contains invalid JSON."
    );
  }

  if (!config.packageDirectories?.length) {
    throw new Error(
      "No packageDirectories found in sfdx-project.json."
    );
  }

  const packageDirectories =
    config.packageDirectories.map((pkg) => ({
      path: pkg.path,
      fullPath: path.resolve(
        rootPath,
        pkg.path
      ),
      default: pkg.default === true,
    }));

  return {
    name: config.name ?? path.basename(rootPath),

    apiVersion: config.sourceApiVersion,

    rootPath,

    packageDirectories,
  };
}