import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startParam = searchParams.get("start");
    const endParam = searchParams.get("end");

    const where: { createdAt?: { gte?: Date; lte?: Date } } = {};
    if (startParam) {
      where.createdAt = { ...where.createdAt, gte: new Date(startParam) };
    }
    if (endParam) {
      const end = new Date(endParam);
      end.setHours(23, 59, 59, 999);
      where.createdAt = { ...where.createdAt, lte: end };
    }

    const sales = await prisma.sale.findMany({
      where: Object.keys(where).length ? where : undefined,
      include: { client: true, items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    return NextResponse.json(sales);
  } catch (error) {
    console.error("Erro ao listar vendas:", error);
    return NextResponse.json({ error: "Erro ao listar vendas" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const data = await request.json();
    const items: Array<{ productId: string; quantity: number; unitPrice: number; totalPrice: number }> = data.items || [];
    const clientId = data.clientId || null;

    if (!items.length) {
      return NextResponse.json({ error: "Adicione ao menos um item à venda." }, { status: 400 });
    }

    for (const item of items) {
      if (!item.productId || item.quantity <= 0) {
        return NextResponse.json({ error: "Todos os itens devem ter um produto e quantidade maior que zero." }, { status: 400 });
      }
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

    const count = await prisma.sale.count();
    const saleNumber = `V-${String(count + 1).padStart(6, "0")}`;
    const totalAmount = items.reduce((s, i) => s + i.totalPrice, 0);

    const sale = await prisma.$transaction(async (tx) => {
      const s = await tx.sale.create({
        data: {
          saleNumber,
          clientId,
          totalAmount,
          items: {
            create: items.map((i) => ({
              productId: i.productId,
              quantity: i.quantity,
              unitPrice: i.unitPrice,
              totalPrice: i.totalPrice,
            })),
          },
        },
        include: { client: true, items: { include: { product: true } } },
      });

      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return s;
    });

    return NextResponse.json(sale, { status: 201 });
  } catch (error) {
    console.error("Erro ao registrar venda:", error);
    return NextResponse.json({ error: "Erro ao registrar venda" }, { status: 500 });
  }
}
