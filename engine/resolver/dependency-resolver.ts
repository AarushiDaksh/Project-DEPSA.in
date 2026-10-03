import {
  DependencyEdge,
  DependencyType,
  SalesforceComponent,
} from "../../types/DePSA";

import { ParsedApexClass } from "../parser/apex-parser";

export function resolveApexDependencies(
  apexComponents: ParsedApexClass[],
  components: SalesforceComponent[]
): DependencyEdge[] {
  const edges: DependencyEdge[] = [];

  const componentMap = new Map<string, SalesforceComponent>();

  for (const component of components) {
    componentMap.set(component.name, component);
  }

  for (const apex of apexComponents) {
    for (const reference of apex.references) {
      const target = componentMap.get(reference.target);

      if (!target) {
        continue;
      }

      const dependencyType =
        mapDependencyType(reference.type);

      edges.push({
        id: `${apex.name}-${dependencyType}-${target.name}`,
        source: apex.name,
        target: target.name,
        type: dependencyType,
        confidence: reference.confidence,
        evidence: {
          file: apex.path,
          line: reference.line,
          text: reference.evidence,
        },
      });
    }
  }

  return edges;
}

function mapDependencyType(
  type: ParsedApexClass["references"][number]["type"]
): DependencyType {
  switch (type) {
    case "CLASS":
      return "CALLS";

    case "OBJECT":
      return "QUERIES";

    case "FIELD":
      return "REFERENCES";

    case "METHOD":
      return "CALLS";

    case "DML":
      return "UPDATES";

    default:
      return "DEPENDS_ON";
  }
}