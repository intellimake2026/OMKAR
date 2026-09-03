export type Process = {
  slug: string;
  name: string;
  family: string;
  group: string;
  summary: string;
  description: string;
  characteristics: string[];
  features: string[];
  materials: string[];
  applications: string[];
  accent: string;
  icon: string;
  status?: "Proposed" | "Reviewed" | "Verified" | "Established";
  related?: string[];
  parameters?: { name: string; value: string; unit: string; context: string; source: string }[];
  evidence?: { title: string; detail: string }[];
  visuals?: { title: string; caption: string }[];
};

export const processes: Process[] = [
  {
    slug: "broaching",
    name: "Broaching",
    family: "Subtractive Manufacturing",
    group: "Machining",
    summary: "Precision profiles in a single pass.",
    description: "Broaching uses a specialized multi-tooth cutting tool called a broach. Each successive tooth removes a small amount of material, combining roughing and finishing into one controlled pass for accurate internal and external geometries.",
    characteristics: ["Single-pass operation", "Progressive multi-tooth tool", "High repeatability", "Excellent surface finish", "Close dimensional tolerances"],
    features: ["Keyways", "Splines", "Slots", "Internal profiles", "External profiles", "Gear forms"],
    materials: ["Steel", "Cast iron", "Aluminum", "Bronze"],
    applications: ["Automotive gears", "Aerospace components", "Machine tools", "Fasteners"],
    accent: "#24a8f2",
    icon: "B",
    status: "Verified",
    related: ["milling", "turning", "laser-cutting"],
    parameters: [
      { name: "Cutting speed", value: "3–30", unit: "m/min", context: "Material and tool dependent", source: "ASM Machining Handbook" },
      { name: "Tooth rise", value: "0.02–0.15", unit: "mm/tooth", context: "Typical production range", source: "Tool supplier guidance" },
      { name: "Surface finish", value: "0.8–3.2", unit: "µm Ra", context: "Finish teeth and stable setup", source: "Process capability data" },
    ],
    evidence: [
      { title: "ASM Handbook, Volume 16", detail: "Machining process fundamentals and capability ranges" },
      { title: "Broaching Tool Design Guide", detail: "Tool geometry, tooth rise, and application guidance" },
    ],
    visuals: [
      { title: "Process sequence", caption: "A progressive broach transforms stock into a finished internal profile." },
      { title: "Tool progression", caption: "Successive teeth increase in height to rough, semi-finish, and finish the profile." },
      { title: "Internal profile", caption: "The final geometry is formed in one controlled linear pass." },
    ],
  },
  {
    slug: "turning",
    name: "Turning",
    family: "Subtractive Manufacturing",
    group: "Machining",
    summary: "Rotational cutting for cylindrical parts.",
    description: "Turning removes material from a rotating workpiece using a stationary cutting tool. It is a foundational process for producing shafts, tapers, threads, grooves, and other rotationally symmetric features.",
    characteristics: ["Rotating workpiece", "Continuous cutting", "High dimensional control", "Versatile tooling", "Excellent roundness"],
    features: ["Shafts", "Tapers", "Threads", "Grooves", "Faces", "Bores"],
    materials: ["Steel", "Aluminum", "Titanium", "Engineering plastics"],
    applications: ["Shafts", "Bushings", "Pins", "Hydraulic components"],
    accent: "#47c9ab",
    icon: "T",
    status: "Established",
    related: ["milling", "broaching"],
  },
  {
    slug: "milling",
    name: "Milling",
    family: "Subtractive Manufacturing",
    group: "Machining",
    summary: "Multi-axis cutting for complex geometry.",
    description: "Milling uses a rotating multi-point cutter to remove material as the workpiece advances across controlled axes. Modern CNC milling creates complex surfaces, pockets, slots, and precision features.",
    characteristics: ["Rotating cutter", "Multi-axis motion", "Complex geometry", "Flexible workholding", "Broad tool selection"],
    features: ["Pockets", "Slots", "Contours", "Threads", "Planar faces", "3D surfaces"],
    materials: ["Aluminum", "Steel", "Titanium", "Polymers"],
    applications: ["Molds", "Aerospace structures", "Fixtures", "Enclosures"],
    accent: "#a787ff",
    icon: "M",
    status: "Verified",
    related: ["turning", "broaching", "laser-cutting"],
  },
  {
    slug: "casting",
    name: "Casting",
    family: "Formative Manufacturing",
    group: "Casting",
    summary: "Molten material shaped inside a mold.",
    description: "Casting forms a component by pouring molten material into a shaped mold and allowing it to solidify. Process variants balance tooling cost, production rate, surface finish, and geometric complexity.",
    characteristics: ["Near-net-shape forming", "Complex internal cavities", "Wide size range", "Scalable production", "Material efficient"],
    features: ["Thin walls", "Ribs", "Bosses", "Cavities", "Textures", "Integrated features"],
    materials: ["Aluminum", "Iron", "Steel", "Zinc"],
    applications: ["Engine blocks", "Pump housings", "Cookware", "Structural nodes"],
    accent: "#ff9b5f",
    icon: "C",
    status: "Reviewed",
    related: ["milling"],
  },
  {
    slug: "laser-cutting",
    name: "Laser Cutting",
    family: "Subtractive Manufacturing",
    group: "Thermal Cutting",
    summary: "Focused energy for precise sheet profiles.",
    description: "Laser cutting focuses a high-energy beam to melt, burn, or vaporize material along a programmed path. It offers high speed, narrow kerfs, and excellent flexibility without dedicated hard tooling.",
    characteristics: ["Non-contact process", "Narrow kerf", "Fast setup", "High automation", "Intricate profiles"],
    features: ["Sheet profiles", "Fine details", "Vent patterns", "Tabs", "Micro holes", "Engraving"],
    materials: ["Steel", "Stainless steel", "Aluminum", "Acrylic"],
    applications: ["Sheet enclosures", "Brackets", "Signage", "Electrical panels"],
    accent: "#ff5d7c",
    icon: "L",
    status: "Verified",
    related: ["milling", "broaching"],
  },
];

export const processGroups = [
  { name: "Subtractive Manufacturing", count: 18, active: true },
  { name: "Casting", count: 9 },
  { name: "Forming", count: 12 },
  { name: "Additive Manufacturing", count: 11 },
  { name: "Joining", count: 14 },
  { name: "Finishing", count: 16 },
  { name: "Heat Treatment", count: 10 },
  { name: "Surface Engineering", count: 8 },
  { name: "Hybrid Processes", count: 5 },
];
