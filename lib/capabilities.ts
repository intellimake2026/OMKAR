/** Functional operations, distinct from desired part geometry and surface outcomes. */
export const capabilities = [
  { id: "material-removal", name: "Material Removal", description: "Remove material from a workpiece through a controlled processing action." },
  { id: "controlled-rotary-motion", name: "Controlled Rotary Motion", description: "Control rotation of a tool or workpiece." },
  { id: "xyz-positioning", name: "XYZ Positioning", description: "Position a tool or workpiece along three controlled linear axes." },
  { id: "workpiece-fixturing", name: "Workpiece Fixturing", description: "Locate and secure the workpiece during processing." },
  { id: "coolant-delivery", name: "Coolant Delivery", description: "Deliver coolant to the processing zone." },
  { id: "quality-inspection", name: "Quality Inspection", description: "Measure and inspect workpieces against specified acceptance criteria." },
  { id: "gas-compression", name: "Gas Compression", description: "Raise and control gas pressure for a process." },
  { id: "abrasive-metering", name: "Abrasive Metering", description: "Regulate the quantity and flow of abrasive supplied to a process." },
  { id: "controlled-laser-energy", name: "Controlled Laser Energy", description: "Deliver laser energy with controlled processing parameters." },
  { id: "force-controlled-insertion", name: "Force-Controlled Insertion", description: "Insert a component while controlling and monitoring applied force." },
  { id: "material-transport", name: "Material Transport", description: "Move material between locations or processing stages." },
] as const;
export type CapabilityId = typeof capabilities[number]["id"];
export type ProcessCapabilityRequirement = {
  processSlug: string;
  capabilityId: CapabilityId;
  evidence: string;
};
// Initial, partial normalization of the supplied profiles. No machine provision is inferred.
export const processCapabilityRequirements: ProcessCapabilityRequirement[] = [
  ...["end-milling", "drilling"].flatMap(processSlug => [
    { processSlug, capabilityId: "controlled-rotary-motion" as const, evidence: "Section 5: variable-frequency spindle motor subsystem." },
    { processSlug, capabilityId: "xyz-positioning" as const, evidence: "Section 5: multi-axis X, Y, Z servo motion control." },
    { processSlug, capabilityId: "workpiece-fixturing" as const, evidence: "Section 5: workholding and clamping subsystem." },
    { processSlug, capabilityId: "coolant-delivery" as const, evidence: "Section 5: high-pressure coolant pump and delivery subsystem." },
    { processSlug, capabilityId: "quality-inspection" as const, evidence: "Section 5: metrology, measurement and inspection gauges." },
  ]),
  { processSlug: "broaching", capabilityId: "workpiece-fixturing", evidence: "Section 5: rigid fixture base and hydraulic / pneumatic clamping." },
  { processSlug: "broaching", capabilityId: "coolant-delivery", evidence: "Section 5: high-pressure / high-volume coolant delivery nozzles." },
  { processSlug: "broaching", capabilityId: "quality-inspection", evidence: "Section 5: post-process CMM and optical metrology stations." },
];
/** Machine model records must declare their own evidenced provisions; a process link is not proof. */
export type MachineCapabilityProvision = {
  machineModelId: string;
  configuration: string;
  limits: { parameter: string; minimum?: number; maximum?: number; unit: string; evidence: string }[];
  capabilityId: CapabilityId;
  evidence: string;
};
export const machineCapabilityProvisions: MachineCapabilityProvision[] = [];

export type CapabilityDocumentation = {
  capabilityId: CapabilityId;
  parameters: { name: string; definition: string; unit?: string; evidence: string }[];
  constraints: { description: string; evidence: string }[];
  references: { title: string; source: string }[];
};
// Definitions are editorial taxonomy entries; parameters and constraints await sourced documentation.
export const capabilityDocumentation: CapabilityDocumentation[] = capabilities.map(c => ({
  capabilityId: c.id, parameters: [], constraints: [], references: [],
}));
