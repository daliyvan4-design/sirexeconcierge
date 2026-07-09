import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) ?? "events";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Fichier trop volumineux (max 5 Mo)" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Format non supporte (JPG, PNG, WebP)" }, { status: 400 });
    }

    const ext = file.name.split(".").pop() ?? "jpg";
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: false,
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
    });
  } catch (err) {
    console.error("[upload] error:", err);
    return NextResponse.json(
      { error: "Erreur upload" },
      { status: 500 },
    );
  }
}
