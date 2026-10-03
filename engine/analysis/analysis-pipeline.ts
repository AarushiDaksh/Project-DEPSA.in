import {
  DependencyEdge,
  SalesforceComponent,
} from "../../types/DePSA";

import {
  discoverSFDXProject,
} from "../ingestion/project-discovery";

import {
  discoverMetadata,
} from "../ingestion/metadata-discovery";

import {
  parseApexFile,
} from "../parser/apex-parser";

import {
  resolveApexDependencies,
} from "../resolver/dependency-resolver";

export interface DEPSAAnalysis {
  project: {
    name: string;
    rootPath: string;
    apiVersion?: string;
  };

  metadata: ReturnType<typeof discoverMetadata>;

  apex: {
    classes: ReturnType<typeof parseApexFile>[];
  };

  dependencies: DependencyEdge[];
}

export function analyzeProject(
  projectRoot: string
): DEPSAAnalysis {
  // 1. Discover SFDX project
  const project = discoverSFDXProject(projectRoot);

  console.log(
    `Analyzing project: ${project.name}`
  );

  // 2. Discover Salesforce metadata
  const metadata = discoverMetadata(project);

  // 3. Find Apex source files
  const apexFiles = metadata.components
    .filter(
      (component) =>
        component.type === "ApexClass" ||
        component.type === "ApexTrigger"
    )
    .flatMap(
      (component) => component.files
    )
    .filter(
      (file) =>
        file.endsWith(".cls") ||
        file.endsWith(".trigger")
    );

  // 4. Parse Apex
  const apex = apexFiles.map((file) => {
    return parseApexFile(file);
  });

  // 5. Convert metadata inventory
  //    into DEPSA components
  const components: SalesforceComponent[] =
    metadata.components.map((component) => ({
      id: component.id,
      name: component.name,
      type: component.type as SalesforceComponent["type"],
      path: component.path,
    }));

  // 6. Resolve dependencies
  const dependencies =
    resolveApexDependencies(
      apex,
      components
    );

  // 7. Return complete analysis
  return {
    project: {
      name: project.name,
      rootPath: project.rootPath,
      apiVersion: project.apiVersion,
    },

    metadata,

    apex: {
      classes: apex,
    },

    dependencies,
  };
}