import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const items: Array<{ productId?: string; description: string; quantity: number; unitPrice: number; totalPrice: number }> = data.items || [];

    // Validar estoque dos itens que têm produto (saída automática do estoque)
    for (const item of items) {
      if (item.productId && item.quantity > 0) {
        const p = await prisma.product.findUnique({ where: { id: item.productId }, select: { name: true, stock: true } });
        if (!p) {
          return NextResponse.json({ error: `Produto não encontrado.` }, { status: 400 });
        }
        if (p.stock < item.quantity) {
          return NextResponse.json(
            { error: `"${p.name}" possui apenas ${p.stock} unidade(s) em estoque. Solicitado: ${item.quantity}.` },
            { status: 400 }
          );
        }
      }
    }

    const orderCount = await prisma.order.count();
    const orderNumber = `OS-${String(orderCount + 1).padStart(6, "0")}`;
    const totalAmount = items.reduce((sum: number, item: any) => sum + item.totalPrice, 0);

    const order = await prisma.$transaction(async (tx) => {
      const o = await tx.order.create({
        data: {
          clientId: data.clientId,
          orderNumber,
          description: data.description || null,
          status: "PENDING",
          totalAmount,
          items: {
            create: items.map((item: any) => ({
              productId: item.productId || null,
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
            })),
          },
        },
        include: { client: true, items: true },
      });

      // Baixar estoque nos itens com produto
      for (const item of items) {
        if (item.productId && item.quantity > 0) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }

      return o;
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Error creating order" },
      { status: 500 }
    );
  }
}
