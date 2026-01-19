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

    // Generate order number
    const orderCount = await prisma.order.count();
    const orderNumber = `OS-${String(orderCount + 1).padStart(6, "0")}`;

    // Calculate total amount
    const totalAmount = data.items.reduce(
      (sum: number, item: any) => sum + item.totalPrice,
      0
    );

    const order = await prisma.order.create({
      data: {
        clientId: data.clientId,
        orderNumber,
        description: data.description || null,
        status: "PENDING",
        totalAmount,
        items: {
          create: data.items.map((item: any) => ({
            productId: item.productId || null,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          })),
        },
      },
      include: {
        client: true,
        items: true,
      },
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
