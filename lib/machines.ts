export const machineTypes = [
  {id:"cnc-milling-machine",name:"CNC Milling Machine", category:"Machining", process:"milling", text:"Rotating cutters and controlled axes for pockets, contours, and complex parts."},
  {id:"cnc-lathe",name:"CNC Lathe", category:"Machining", process:"turning", text:"Precision turning for shafts, cylindrical components, and threaded features."},
  {id:"broaching-machine",name:"Broaching Machine", category:"Machining", process:"broaching", text:"Progressive cutting tools for repeatable keyways and internal profiles."},
  {id:"laser-cutting-system",name:"Laser Cutting System", category:"Thermal Cutting", process:"laser-cutting", text:"Focused energy for intricate sheet profiles and efficient material cutting."},
  {id:"casting-equipment",name:"Casting Equipment", category:"Casting", process:"casting", text:"Molds and molten material handling for near-net-shape components."},
] as const;

export type MachineTypeId = typeof machineTypes[number]["id"];

/** Specifications describe a documented model/configuration, never a generic type. */
export type ModelSpecification = {
  parameter: string;
  value: string | number;
  unit?: string;
  evidence: string;
};
export type MachineModel = {
  id: string;
  machineTypeId: MachineTypeId;
  manufacturer: string;
  name: string;
  configuration: string;
  specifications: ModelSpecification[];
  settings: ModelSpecification[];
  documentation: { title: string; source: string }[];
  evidence: string;
};
// Add models only after identifying their manufacturer, configuration and source specifications.
export const machineModels: MachineModel[] = [];
export function modelsForType(typeId: MachineTypeId): MachineModel[] {
  return machineModels.filter(model => model.machineTypeId === typeId);
}
