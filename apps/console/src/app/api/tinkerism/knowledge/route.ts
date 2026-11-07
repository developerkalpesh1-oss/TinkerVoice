import { getSession } from "@/src/lib/server-session";
import { knowledgeFileError } from "@/src/lib/tinkerism/campaigns";
import { extractKnowledgeFile, extractKnowledgeUrl } from "@/src/lib/tinkerism/knowledge-extract";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.user) {
    return Response.json({ error: "Sign in to add knowledge." }, { status: 401 });
  }

  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const body = (await request.json()) as { url?: unknown };
      if (typeof body.url !== "string") {
        return Response.json({ error: "Enter a website URL." }, { status: 400 });
      }
      const extracted = await extractKnowledgeUrl(body.url);
      return Response.json({
        name: extracted.name,
        locator: body.url.trim(),
        text: extracted.text,
      });
    }

    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return Response.json({ error: "Choose a PDF, DOCX, or TXT file." }, { status: 400 });
    }
    const fileError = knowledgeFileError(file.name, file.size);
    if (fileError) return Response.json({ error: fileError }, { status: 400 });
    const text = await extractKnowledgeFile(file.name, new Uint8Array(await file.arrayBuffer()));
    return Response.json({ name: file.name, locator: file.name, text });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not read that knowledge source.";
    return Response.json({ error: message }, { status: 400 });
  }
}
