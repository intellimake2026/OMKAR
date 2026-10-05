# Manufacturing Process Profile: Drilling

### 0. Process Name (and Aliases)
* **Primary Name:** Drilling
* **Aliases:** Hole Making, Twist Drilling, Boring (related/secondary), Deep Hole Drilling (specialized variant), Gun Drilling (specialized variant)

---

### 1. Process Overview & Definition
* **Definition:** A mass-reducing (subtractive), mechanical machining process that uses a rotating cutting tool (drill bit) to produce or enlarge a circular hole in a solid workpiece. The tool applies axial thrust force ($F_z$) and rotational torque ($M_z$) to shear away material in the form of chips through mechanical fracture and plastic deformation along the main cutting edges.
* **Process Classification:** 
  * **Material Action:** Mass-Reducing (Subtractive)
  * **Mechanism:** Mechanical Shear / Cutting
  * **Tool Engagement:** Contact / Multi-Point Rotary Cutting Tool
  * **Thermal Impact:** Secondary friction-generated heat; requires active cooling to prevent thermal damage to tool and substrate.

---

### 2. Inputs & Outputs

| Category | Details |
| :--- | :--- |
| **Inputs** | **Raw Material / Workpiece:** Metals (Steels, Aluminum, Titanium, Superalloys), Polymers, Composites (CFRP/GFRP), Ceramics/Glass (with diamond tooling), Wood.<br>**Tooling:** Twist Drill Bits, Indexable Drills, Spade Drills, Gun Drills (High-Speed Steel, Solid Carbide, Cobalt, Diamond-coated, TiN/TiAlN coated).<br>**Media & Consumables:** Cutting Fluid/Coolant (Water-soluble emulsion, Neat oil, Minimum Quantity Lubrication - MQL), Compressed Air.<br>**Power / Energy:** Electrical energy (spindle motor drive, axis linear drives), Pneumatic/Hydraulic power (fixture clamping, tool unclamp).<br>**Fixturing & Workholding:** Vises, Modular CNC Fixtures, Collet Chucks, Hydraulic Chucks, Shrink-Fit Holders, Vacuum Plates.<br>**Control Data:** CNC G-Code Program (Canned Cycles e.g., G81, G83, G73), Tool Offset Tables, Process Recipe (Speeds & Feeds). |
| **Outputs** | **Processed Workpiece:** Workpiece featuring bored/drilled circular through-holes or blind holes meeting dimensional tolerances (IT8–IT11 typical), surface finish specifications ($R_a$ 0.8–3.2 µm), and positioning limits.<br>**Waste / Byproducts:** Metal Chips / Swarf (continuous, segment, or granular chips), Burrs (entry and exit burrs), Spent Cutting Fluid / Used Coolant Sludge, Filter Cake.<br>**Emissions & Discharges:** Friction Heat / Thermal Dissipation, Coolant Mist / Aerosols, Noise / Acoustic Vibrations.<br>**Quality & Execution Logs:** Machine Controller Logs, CMM / Bore Gage Dimensional Reports, Tool Life Tracking Data, Process Load Logs. |

---

### 3. Key Process Parameters (Control Variables)

* **Cutting Speed ($V_c$):** Linear velocity at the outer diameter of the drill tip. Measured in meters per minute (m/min) or surface feet per minute (SFM). 
  * *Typical Range:* 20–60 m/min (Tool Steel), 100–350 m/min (Aluminum Alloys), 15–35 m/min (Titanium Alloys).
* **Spindle Speed ($n$):** Rotational velocity calculated from cutting speed and tool diameter ($D$): 
  $$\text{RPM} = \frac{V_c \times 1000}{\pi \times D}$$
* **Feed Rate ($f$ or $f_z$):** Axial displacement of the tool per revolution (mm/rev or in/rev) or per tooth (mm/tooth).
  * *Typical Range:* 0.05–0.40 mm/rev depending on drill diameter, rigidity, and material hardness.
* **Axial Thrust Force ($F_z$) & Torque ($M_z$):** Forces exerted along the spindle axis and rotational axis, directly affected by feed rate, web thickness, and sharp edge state.
* **Drill Tool Geometry:**
  * **Point Angle ($\theta$):** Standard 118° (general work) to 135° (hard materials/high feed, self-centering split point).
  * **Helix Angle ($\beta$):** Typically 20°–35° to facilitate chip evacuation.
  * **Lip Relief Angle & Web Thickness:** Controls clearance and center rigidity.
* **Peck Depth / Pecking Increment ($Q$):** Step-down axial distance before retracting the drill bit to break and clear chips, critical when hole aspect ratio (Depth-to-Diameter $L/D$) exceeds 3:1.
* **Coolant Pressure & Flow Rate:**
  * **External Flood:** 2–5 bar pressure, high volume.
  * **Through-Tool Coolant (TSC):** 20–70+ bar (300–1000+ psi) high-pressure delivery directly to the cutting zone for deep hole evac.
  * **MQL Flow Rate:** 10–50 mL/h of atomized lubricant mixed with air (4–6 bar).

---

### 4. Process Steps (Sequential Workflow)

1. **Preparation & Fixturing**
   * Inspect and clean the raw material/workpiece surface.
   * Position and clamp the workpiece securely into the machine table using a vise, chuck, or specialized fixture to resist axial thrust forces ($F_z$) and rotational torque ($M_z$).
   * Perform spot-drilling / center-drilling if required to establish an accurate starter indentation and prevent tool walk.

2. **System Setup / Medium Conditioning**
   * Load the selected drill bit into a high-precision tool holder (e.g., Hydraulic or Shrink-Fit Chuck).
   * Measure tool length offset ($Z$) and tool diameter/runout ($X, Y$) using a tool setter.
   * Condition and check cutting fluid: verify concentration (Brix %), pH levels, fluid level, and delivery pump system pressure.

3. **Material / Energy Metering & Mixing**
   * Activate coolants/lubricants (adjust flow rate and pressure setting for high-pressure through-spindle cooling or MQL air-mist ratio).
   * Initialize spindle drive power and motion control system circuits.

4. **Tooling & Positioning**
   * Move machine axes ($X, Y$) to align the spindle center axis precisely with the target hole coordinates.
   * Rapid traverse the $Z$-axis down to the safety distance (e.g., $Z = +2.0$ mm or $+0.1$ in above the reference surface).

5. **Energy / Stream Acceleration**
   * Accelerate the spindle to the target operating speed ($n$ in RPM) prior to workpiece engagement.
   * Engage active high-pressure coolant stream or MQL delivery system.

6. **Processing / Machining / Erosion**
   * Feed the rotating drill axially into the material at the specified feed rate ($f$ in mm/rev).
   * Execute programmed peck drilling cycles (e.g., G83 deep hole peck cycle or G73 chip breaker cycle) to systematically clear chips and suppress thermal buildup.
   * Dwell briefly at the bottom of the hole (if blind hole depth tolerance requires) to clean up the hole base.
   * Retract the drill tool axially ($Z$-axis clearance position) while the spindle continues rotating.

7. **Inspection & Quality Check**
   * Stop spindle rotation and turn off coolant feed.
   * Clean hole of residual coolant and loose swarf using air blast or vacuum extraction.
   * Perform inline or offline metrology check: measure hole diameter using plug gages (Go / No-Go) or bore gages; check depth, perpendicularity, surface roughness ($R_a$), and entrance/exit burr size.

8. **Waste Management & Post-Processing**
   * Automatically convey metal chips out of the machining envelope via screw/slat chip conveyor.
   * Route spent cutting fluid through filtration systems (magnetic separators, paper media, centrifuge) to remove micro-particles and recycle clean fluid.
   * Execute deburring operations on workpiece entry and exit holes (chemically, mechanically, or manually).

---

### 5. Required Capabilities & Sub-Systems

| Process Step | Sub-System / Capability Required |
| :--- | :--- |
| **1. Preparation & Fixturing** | **Workholding Sub-system:** High-rigidity Vises, Hydraulic Clamping, T-Slot Tables, or Zero-Point Clamping Systems capable of resisting high dynamic torque and thrust loads. Spot-drilling capability. |
| **2. System Setup / Medium Conditioning** | **Tool Handling & Presetting:** Tool Changer (ATC), Laser/Contact Tool Setter, Hydraulic/Shrink-Fit Tooling, Coolant Fluid Conditioning Sub-system (Refractometers, pH Monitors, Skimmers). |
| **3. Material / Energy Metering & Mixing** | **Fluid Metering & Delivery System:** High-Pressure Variable-Displacement Coolant Pumps, Proportional Valves, MQL Atomizer/Mixing Units. |
| **4. Tooling & Positioning** | **CNC Motion Control Sub-system:** Multi-axis ($X, Y, Z$) Servo Motors with closed-loop optical linear encoders for high-precision positional repeatability ($\le \pm 0.002$ mm). |
| **5. Energy / Stream Acceleration** | **Spindle Drive Sub-system:** High-Torque / High-Speed Variable Frequency Drive (VFD) Spindle Motor, Closed-loop Vector Control, High-Pressure Through-Spindle Rotary Union. |
| **6. Processing / Machining / Erosion** | **Axial Feed Acceleration & Adaptive Controller:** High-Thrust $Z$-Axis Ball Screw Drive, Adaptive Feed Control (Load/Torque Monitoring for tool breakage detection), CNC Canned Cycle Execution Firmware (G81, G83, G73). |
| **7. Inspection & Quality Check** | **Metrology & Inspection Sub-system:** On-Machine Touch Probes, Air Gages, Cylindrical Plug Gages, Surface Roughness Testers, Coordinate Measuring Machines (CMM). |
| **8. Waste Management & Post-Processing** | **Auxiliary Processing Sub-system:** Chip Conveyors (Hinged Belt / Drag Chain), Coolant Filtration & Separation Units (Trampi-Oil Skimmer, Centrifugal Filter), Deburring Stations (Brush, Countersink, Thermal Deburring). |
