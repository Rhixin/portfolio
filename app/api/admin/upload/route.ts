import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/adminAuth";

const BUCKET = "project-images";
const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB, comfortably under Vercel's 4.5MB request body limit

export async function POST(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  const formData = await req.formData().catch(() => null);
  const files = (formData?.getAll("files") ?? []).filter((f): f is File => f instanceof File);

  if (files.length === 0) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }

  for (const file of files) {
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: `"${file.name}" is not an image file` },
        { status: 400 }
      );
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `"${file.name}" exceeds the 4MB size limit` },
        { status: 400 }
      );
    }
  }

  const supabase = getSupabaseAdmin();
  const urls: string[] = [];

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
    const path = `${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, Buffer.from(arrayBuffer), {
        contentType: file.type || "application/octet-stream",
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    urls.push(data.publicUrl);
  }

  return NextResponse.json({ urls });
}
