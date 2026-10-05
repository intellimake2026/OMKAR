import { Portal } from "@/components/portal";
import { processes } from "@/lib/processes";
import { notFound } from "next/navigation";
export function generateStaticParams() { return processes.map(({slug}) => ({slug})); }
export default async function Page({params}: {params: Promise<{slug:string}>}) {
 const {slug} = await params;
 if (!processes.some(p => p.slug === slug)) notFound();
 return <Portal screen="detail" slug={slug} />;
}
