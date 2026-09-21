---
slug: broaching
title: Broaching
family: Subtractive Manufacturing
subcategory: Machining
status: Reviewed
image: diagram.jpeg
evidenceStatus: Pending
---

# Manufacturing Process Profile: Broaching

## Process name and aliases

- **Primary name:** Broaching
- **Aliases:** Internal Broaching, Surface/External Broaching, Pot Broaching, Rotary/Wobble Broaching, Pull/Push Broaching

## Process overview and definition

- **Definition:** Broaching is a high-precision, high-efficiency machining process that uses a multi-toothed cutting tool (a broach) to progressively remove material from a workpiece in a single linear or rotary pass. As the tool advances, each successive tooth rises slightly higher than the previous one (rise per tooth), shaping the workpiece to the inverse geometry of the tool.
- **Process type:** Mass-reducing / subtractive manufacturing
- **Classification:** Mechanical, contact-based, multi-tooth linear or rotary machining

## Inputs and outputs

| Category | Details |
| --- | --- |
| **Inputs** | **Workpiece material:** Pre-machined blanks, castings, forgings, and pre-drilled or bored stock, including steels, aluminum, brass, titanium, and superalloys.<br><br>**Tooling:** Broach bar or assembly (pull-type, push-type, pot broach, or surface slab) with specified pitch, rise per tooth, and gullet design.<br><br>**Media and consumables:** High-performance cutting oil or soluble-oil coolant, neat oils, and extreme-pressure additives.<br><br>**Power or carrier medium:** Hydraulic power unit, servo-electric ball-screw drive, or pneumatic tool latches.<br><br>**Fixturing:** Rigid workholding, horn fixtures, matrix clamps, and automated shuttle or pot holders.<br><br>**Process recipe:** Stroke speed, pull or push tonnage limit, stroke length, coolant flow and pressure, and tool-lubrication timing. |
| **Outputs** | **Processed workpiece:** Finished component with internal or external keyways, splines, non-circular holes, gear profiles, or flat and contoured surfaces.<br><br>**Removed material:** Metal chips or swarf, typically curled ribbons or broken chips.<br><br>**Spent media and waste:** Recycled or spent cutting fluid, tramp-oil sludge, and filter-media waste.<br><br>**Dust and debris:** Microscopic metallic fines suspended in coolant or air.<br><br>**Quality measurements:** Bore diameter, spline pitch diameter, tooth profile and lead errors, surface roughness, and dimensional-tolerance logs.<br><br>**Execution records:** Peak hydraulic pressure or tonnage curves, cycle time, tool stroke count, and force-versus-displacement telemetry. |

## Key process parameters

> Parameter values below are provisional engineering guidance. Source citations and application-specific validation are required before these values can be marked Verified.

### Rise per tooth

The incremental height increase between consecutive teeth.

- Roughing teeth: 0.03–0.10 mm (0.001–0.004 in)
- Semi-finishing teeth: 0.015–0.03 mm
- Finishing teeth: 0.002–0.01 mm

### Cutting speed

The speed at which the broach moves past the workpiece.

- Low-speed hydraulic: 1.5–9 m/min (5–30 ft/min)
- High-speed servo: 15–35+ m/min (50–120+ ft/min)

### Tooth pitch and engagement count

Pitch determines the distance between teeth. The tool is commonly designed so that at least two or three teeth remain engaged continuously to reduce chatter and tooth breakage.

- Provisional formula: `P ≈ 1.25–1.5 × √(length of cut)`

### Gullet volume and geometry

The cavity between teeth stores curled chips during the stroke. It must be sized larger than the volume of compressed swarf produced during each tooth pass.

### Tonnage and cutting force

Maximum ram force depends on rise per tooth, material shear strength, the total number of engaged teeth, and cut width.

- Typical machine range: 2–50+ tons, depending on capacity and application depth

### Rake and relief angles

Tool-tooth angles are selected for the material's ductility and chip-curling behavior.

- Steel rake angle: 10–20°
- Cast-iron rake angle: 5–10°
- Relief angle: 0.5–3°

### Coolant flow and pressure

Cutting oil is delivered to the tool-workpiece interface to flush chips from the gullets and control friction and thermal expansion.

## Process workflow

1. **Preparation and fixturing**  
   Inspect and clean the workpiece blank. Secure it in the broaching fixture or faceplate with pneumatic or hydraulic clamps to prevent movement under axial load.

2. **System setup and medium conditioning**  
   Initialize the hydraulic power unit or servo drive. Activate coolant filtration and pumping, then allow fluid pressure and temperature to stabilize.

3. **Material and energy metering**  
   Verify hydraulic pressure and flow. Adjust cutting-fluid concentration or flow rate and configure the machine's safety-tonnage limits.

4. **Tooling and positioning**  
   For internal Broaching, insert the broach pilot through the pre-drilled starter hole and lock the tool into the pull-head or retriever mechanism.

5. **Acceleration**  
   Engage the hydraulic ram or ball screw and accelerate the broach puller to the programmed cutting speed before initial tooth contact.

6. **Machining**  
   Pull or push the broach through or across the workpiece in one continuous stroke. Roughing teeth remove bulk stock, semi-finishing teeth refine the geometry, and finishing teeth establish final size and surface finish.

7. **Inspection and quality check**  
   Unclamp and clean the finished part. Inspect key features with go/no-go gauges, coordinate-measuring machines, optical profile projectors, or surface-roughness testers.

8. **Waste management and post-processing**  
   Return the broach through chip-cleaning brushes. Remove swarf with conveyors and de-oiling equipment, and recirculate coolant through magnetic or paper-bed filters.

## Required capabilities and subsystems

| Process step | Required machine capabilities and subsystems |
| --- | --- |
| **Preparation and fixturing** | Rigid fixture base and alignment tables; hydraulic or pneumatic clamping; part-present or proximity sensing |
| **System setup and medium conditioning** | Hydraulic power unit or servo drives; fluid-temperature control; machine-health and diagnostic controller |
| **Material and energy metering** | Force and tonnage sensors; coolant concentration and pressure regulation; emergency over-tonnage cutoff |
| **Tooling and positioning** | Automatic pull-head and retriever mechanisms; precision linear guideways; tool-clamping and latching actuators |
| **Acceleration** | Variable-speed hydraulic control or servo-motion controllers; closed-loop encoder feedback; acceleration and deceleration profiling |
| **Machining** | Heavy-duty linear ram drive; high-volume coolant delivery; vibration-damping frame and bed |
| **Inspection and quality check** | Force-versus-displacement logging; optional air gauging or in-process probing; CMM and optical metrology |
| **Waste management and post-processing** | Chip-cleaning brushes; drag-chain chip conveyors; magnetic, paper-media, and de-oiling filtration |

## Quality

- Inspect critical internal and external profile dimensions.
- Verify spline pitch diameter, tooth profile, lead error, and bore geometry where applicable.
- Measure surface roughness against the part specification.
- Monitor force-versus-displacement curves for abnormal tool loading or wear.

## Limitations

- Dedicated broaches can have significant design and tooling cost.
- Broach geometry is usually specific to a feature or part family.
- Long tools require careful alignment, handling, and storage.
- Chip evacuation and gullet capacity constrain cut length and material removal.
- Machine tonnage and stroke length limit feasible part geometry.

## Applications

- Internal keyways and splines
- Non-circular holes and precision internal profiles
- External flats, slots, and contoured surfaces
- Gear and transmission components
- High-volume automotive, aerospace, and industrial production

## Evidence

No approved citations are currently attached. Numerical ranges and design rules remain **Reviewed** rather than **Verified** until supporting sources are added and approved.
