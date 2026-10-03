
export type SalesforceComponentType =
  | "ApexClass"
  | "ApexTrigger"
  | "LWC"
  | "Aura"
  | "CustomObject"
  | "CustomField"
  | "Flow"
  | "ValidationRule"
  | "PermissionSet"
  | "Profile"
  | "ExperienceBundle"
  | "CustomMetadata"
  | "CustomLabel"
  | "Unknown";

export type DependencyType =
  | "IMPORTS"
  | "CALLS"
  | "QUERIES"
  | "UPDATES"
  | "TRIGGERS"
  | "REFERENCES"
  | "USES"
  | "DEPENDS_ON"
  | "EXPOSES"
  | "PROTECTED_BY"
  | "VISIBLE_TO";

export interface SalesforceComponent {
  id: string;
  name: string;
  type: SalesforceComponentType;
  path: string;

  metadata?: {
    namespace?: string;
    apiVersion?: string;
    label?: string;
  };
}

export interface DependencyEdge {
  id: string;
  source: string;
  target: string;
  type: DependencyType;
  confidence: number;

  evidence?: {
    file?: string;
    line?: number;
    text?: string;
  };
}

export interface DEPSAProject {
  name: string;
  rootPath: string;

  components: SalesforceComponent[];

  dependencies: DependencyEdge[];

  statistics: {
    totalComponents: number;
    totalDependencies: number;
    apexClasses: number;
    triggers: number;
    lwcComponents: number;
    objects: number;
  };
}
