import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const sale = await prisma.sale.findUnique({
      where: { id: params.id },
      include: {
        client: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!sale) {
      return NextResponse.json({ error: "Venda não encontrada" }, { status: 404 });
    }

    return NextResponse.json(sale);
  } catch (error) {
    console.error("Erro ao buscar venda:", error);
    return NextResponse.json(
      { error: "Erro ao buscar venda" },
      { status: 500 }
    );
  }
}
