import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfWeek, subWeeks, format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const weeks = Math.min(12, Math.max(1, parseInt(searchParams.get("weeks") || "6", 10)));

    // Segunda-feira como início da semana (locale isoWeek)
    const now = new Date();
    const start = startOfWeek(subWeeks(now, weeks), { weekStartsOn: 1 });

    const sales = await prisma.sale.findMany({
      where: { createdAt: { gte: start } },
      select: { totalAmount: true, createdAt: true },
    });

    const byWeek: Record<string, { total: number; count: number; weekStart: Date }> = {};
    for (let i = 0; i < weeks; i++) {
      const ws = startOfWeek(subWeeks(now, weeks - 1 - i), { weekStartsOn: 1 });
      const key = ws.toISOString().slice(0, 10);
      byWeek[key] = { total: 0, count: 0, weekStart: ws };
    }

    for (const s of sales) {
      const ws = startOfWeek(s.createdAt, { weekStartsOn: 1 });
      const key = ws.toISOString().slice(0, 10);
      if (!byWeek[key]) {
        byWeek[key] = { total: 0, count: 0, weekStart: ws };
      }
      byWeek[key].total += s.totalAmount;
      byWeek[key].count += 1;
    }

    const result = Object.entries(byWeek)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([_, v]) => {
        const end = new Date(v.weekStart);
        end.setDate(end.getDate() + 6);
        return {
          weekStart: v.weekStart.toISOString().slice(0, 10),
          weekLabel: `${format(v.weekStart, "dd MMM", { locale: ptBR })} – ${format(end, "dd MMM", { locale: ptBR })}`,
          total: Math.round(v.total * 100) / 100,
          count: v.count,
        };
      });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao buscar vendas por semana:", error);
    return NextResponse.json({ error: "Erro ao buscar resumo" }, { status: 500 });
  }
}
