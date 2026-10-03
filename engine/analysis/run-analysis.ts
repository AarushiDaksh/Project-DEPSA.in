import path from "path";
import { analyzeProject } from "./analysis-pipeline";

const projectPath = path.resolve(
  process.cwd(),
  "test-fixtures/sample-sfdx"
);

const result = analyzeProject(projectPath);

console.log("\n===== DEPSA ANALYSIS =====");

console.log(
  `Project: ${result.project.name}`
);

console.log(
  `Metadata components: ${result.metadata.statistics.totalComponents}`
);

console.log(
  `Metadata files: ${result.metadata.statistics.totalFiles}`
);

console.log(
  `Apex files: ${result.apex.classes.length}`
);

for (const apex of result.apex.classes) {
  console.log(`\n${apex.name}`);

  for (const reference of apex.references) {
    console.log(
      `  → ${reference.type} → ${reference.target}`
    );
  }
}