/**
 * Salesforce metadata registry.
 *
 * This is intentionally data-driven.
 *
 * We do NOT hardcode the parser around a few Salesforce
 * folders. The registry describes metadata that DEPSA
 * knows how to classify.
 */

export interface MetadataDefinition {
  type: string;

  /**
   * Salesforce metadata directory names.
   */
  directories: string[];

  /**
   * Common source file extensions.
   */
  extensions?: string[];

  /**
   * Whether this metadata normally represents a bundle.
   */
  bundle?: boolean;

  /**
   * Whether DEPSA should eventually inspect the
   * contents for relationships.
   */
  analyzable: boolean;
}

export const SALESFORCE_METADATA_REGISTRY: MetadataDefinition[] = [
  {
    type: "ApexClass",
    directories: ["classes"],
    extensions: [".cls"],
    analyzable: true,
  },

  {
    type: "ApexTrigger",
    directories: ["triggers"],
    extensions: [".trigger"],
    analyzable: true,
  },

  {
    type: "LightningComponentBundle",
    directories: ["lwc"],
    bundle: true,
    analyzable: true,
  },

  {
    type: "AuraDefinitionBundle",
    directories: ["aura"],
    bundle: true,
    analyzable: true,
  },

  {
    type: "CustomObject",
    directories: ["objects"],
    bundle: true,
    analyzable: true,
  },

  {
    type: "Flow",
    directories: ["flows"],
    extensions: [".flow-meta.xml"],
    analyzable: true,
  },

  {
    type: "PermissionSet",
    directories: ["permissionsets"],
    extensions: [".permissionset-meta.xml"],
    analyzable: true,
  },

  {
    type: "Profile",
    directories: ["profiles"],
    extensions: [".profile-meta.xml"],
    analyzable: true,
  },

  {
    type: "Layout",
    directories: ["layouts"],
    extensions: [".layout-meta.xml"],
    analyzable: true,
  },

  {
    type: "RecordType",
    directories: ["objects"],
    analyzable: true,
  },

  {
    type: "ValidationRule",
    directories: ["objects"],
    analyzable: true,
  },

  {
    type: "CustomField",
    directories: ["objects"],
    analyzable: true,
  },

  {
    type: "CustomMetadata",
    directories: ["customMetadata"],
    extensions: [".md-meta.xml"],
    analyzable: true,
  },

  {
    type: "CustomLabels",
    directories: ["labels"],
    extensions: [".labels-meta.xml"],
    analyzable: true,
  },

  {
    type: "ExperienceBundle",
    directories: ["experiences"],
    bundle: true,
    analyzable: true,
  },

  {
    type: "EmailTemplate",
    directories: ["email"],
    analyzable: true,
  },

  {
    type: "Reports",
    directories: ["reports"],
    bundle: true,
    analyzable: true,
  },

  {
    type: "Dashboards",
    directories: ["dashboards"],
    bundle: true,
    analyzable: true,
  },

  {
    type: "NamedCredential",
    directories: ["namedCredentials"],
    analyzable: true,
  },

  {
    type: "RemoteSiteSetting",
    directories: ["remoteSiteSettings"],
    analyzable: true,
  },

  {
    type: "ConnectedApp",
    directories: ["connectedApps"],
    analyzable: true,
  },

  {
    type: "CustomPermission",
    directories: ["customPermissions"],
    analyzable: true,
  },

  {
    type: "PermissionSetGroup",
    directories: ["permissionsetgroups"],
    analyzable: true,
  },

  {
    type: "SharingRules",
    directories: ["sharingRules"],
    analyzable: true,
  },

  {
    type: "SharingSettings",
    directories: ["sharingSettings"],
    analyzable: true,
  },

  {
    type: "AssignmentRules",
    directories: ["assignmentRules"],
    analyzable: true,
  },

  {
    type: "AutoResponseRules",
    directories: ["autoResponseRules"],
    analyzable: true,
  },

  {
    type: "EscalationRules",
    directories: ["escalationRules"],
    analyzable: true,
  },

  {
    type: "Workflow",
    directories: ["workflows"],
    bundle: true,
    analyzable: true,
  },
];

export function getMetadataDefinition(
  type: string
): MetadataDefinition | undefined {
  return SALESFORCE_METADATA_REGISTRY.find(
    (metadata) => metadata.type === type
  );
}