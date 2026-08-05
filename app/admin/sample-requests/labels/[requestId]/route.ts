import { requireRole } from "@/lib/auth-helpers";
import { getStoredLabelPdf } from "@/lib/dhl-labels";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ requestId: string }> },
) {
  await requireRole("admin");
  const { requestId } = await context.params;
  if (!/^\d+$/.test(requestId)) return new Response("Not found", { status: 404 });
  const pdf = await getStoredLabelPdf(requestId);
  if (!pdf) return new Response("Label PDF not found", { status: 404 });
  return new Response(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="ehc-sample-label-${requestId}.pdf"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
