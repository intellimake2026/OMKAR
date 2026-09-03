import { ManufacturingLibrary } from "@/components/manufacturing-library";
import { processes } from "@/lib/processes";

export default function Home() {
  return <ManufacturingLibrary initialProcesses={processes} />;
}
