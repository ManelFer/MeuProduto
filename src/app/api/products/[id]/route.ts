import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Suportar tanto params como Promise quanto objeto direto (Next.js 13+ e 15+)
    const resolvedParams = params instanceof Promise ? await params : params;
    const data = await request.json();
    const product = await prisma.product.update({
      where: { id: resolvedParams.id },
      data: {
        name: data.name,
        description: data.description || null,
        sku: data.sku,
        price: data.price,
        cost: data.cost,
        stock: data.stock,
        minStock: data.minStock,
        category: data.category || null,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Error updating product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Suportar tanto params como Promise quanto objeto direto (Next.js 13+ e 15+)
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams.id;

    if (!id) {
      return NextResponse.json({ error: "ID do produto é obrigatório" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        saleItems: { take: 1 },
        orderItems: { take: 1 },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }

    // Verificar se o produto está vinculado a vendas ou ordens
    if (product.saleItems.length > 0 || product.orderItems.length > 0) {
      return NextResponse.json(
        { error: "Não é possível excluir este produto pois ele está vinculado a vendas ou ordens de serviço." },
        { status: 400 }
      );
    }

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Produto excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
    return NextResponse.json({ error: "Erro ao excluir produto" }, { status: 500 });
  }
}
