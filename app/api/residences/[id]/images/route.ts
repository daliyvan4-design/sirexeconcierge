import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireRole("ULTRA_ADMIN", "SUPER_ADMIN");
  if (error) return error;

  try {
    const { id } = await params;
    const body = await req.json();

    const maxOrdre = await prisma.residenceImage.findFirst({
      where: { residenceId: id },
      orderBy: { ordre: "desc" },
      select: { ordre: true },
    });

    const image = await prisma.residenceImage.create({
      data: {
        residenceId: id,
        url: body.url,
        legende: body.legende,
        ordre: (maxOrdre?.ordre ?? -1) + 1,
      },
    });

    return NextResponse.json({ success: true, id: image.id });
  } catch (err) {
    console.error("[residence-images] create error:", err);
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { error } = await requireRole("ULTRA_ADMIN", "SUPER_ADMIN");
  if (error) return error;

  try {
    const { searchParams } = new URL(req.url);
    const imageId = searchParams.get("imageId");

    if (!imageId) {
      return NextResponse.json({ error: "imageId required" }, { status: 400 });
    }

    await prisma.residenceImage.delete({ where: { id: imageId } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[residence-images] delete error:", err);
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}
