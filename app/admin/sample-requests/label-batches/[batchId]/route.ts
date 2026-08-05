import { requireRole } from "@/lib/auth-helpers";
import { getStoredBatchPdf } from "@/lib/dhl-labels";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ batchId: string }> },
) {
  await requireRole("admin");
  const { batchId } = await context.params;
  if (!/^[0-9a-f-]{36}$/i.test(batchId)) return new Response("Not found", { status: 404 });
  const pdf = await getStoredBatchPdf(batchId);
  if (!pdf) return new Response("Ready batch PDF not found", { status: 404 });
  const day = new Date().toISOString().slice(0, 10);
  return new Response(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="ehc-sample-labels-${day}.pdf"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
