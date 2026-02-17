"server-only";

import prisma from "@/shared/config/prisma.config";
import { requirePermissionAndReturnUser } from "@/shared/lib/session";
import { formatDate, formatDuration } from "@/shared/lib/utils";
import {
  addDays,
  endOfMonth,
  startOfMonth,
  startOfYear,
  subMonths,
} from "date-fns";
import { cache } from "react";

export const getExpensesStats = cache(async () => {
  try {
    const now = new Date();
    const currentMonthStartDate = startOfMonth(now);
    const currentMonthEndDate = endOfMonth(now);
    const currentMember = await requirePermissionAndReturnUser("expense", [
      "read",
    ]);

    const [revenueAgg, expenseAgg, topCategoryAgg] = await Promise.all([
      prisma.payment.aggregate({
        where: {
          gymId: currentMember.organizationId,
          paymentReceivedDate: {
            gte: currentMonthStartDate,
            lte: currentMonthEndDate,
          },
        },
        _sum: { amountPaid: true },
      }),

      prisma.expense.aggregate({
        where: {
          gymId: currentMember.organizationId,
          expenseDate: {
            gte: currentMonthStartDate,
            lte: currentMonthEndDate,
          },
        },
        _sum: { amount: true },
      }),

      prisma.expense.groupBy({
        by: ["category"],
        where: {
          gymId: currentMember.organizationId,
          expenseDate: {
            gte: currentMonthStartDate,
            lte: currentMonthEndDate,
          },
        },
        _sum: { amount: true },
        orderBy: { _sum: { amount: "desc" } },
        take: 1,
      }),
    ]);

    const revenue = revenueAgg._sum.amountPaid ?? 0;
    const expenses = expenseAgg._sum.amount ?? 0;
    const profit = revenue - expenses;

    const topCategory = topCategoryAgg[0]?.category ?? null;
    const topCategoryAmount = topCategoryAgg[0]?._sum.amount ?? 0;

    return {
      revenue,
      expenses,
      profit,
      topCategory,
      topCategoryAmount,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
});

export const getExpenesList = cache(async () => {
  try {
    const now = new Date();
    const currentMonthStartDate = startOfMonth(now);
    const currentMonthEndDate = endOfMonth(now);
    const currentMember = await requirePermissionAndReturnUser("expense", [
      "read",
    ]);
    return await prisma.expense.findMany({
      where: {
        gymId: currentMember.organizationId,
        expenseDate: {
          gte: currentMonthStartDate,
          lte: currentMonthEndDate,
        },
      },
      select: {
        id: true,
        expenseDate: true,
        amount: true,
        category: true,
        title: true,
        description: true,

        paymentMethod: true,
        isRecurring: true,
        vendorName: true,
        expenseNature: true,
        recurringInterval: true,
      },
      orderBy: {
        expenseDate: "desc",
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
});

export const getMonthlyTrendChartData = cache(async () => {
  try {
    const currentMember = await requirePermissionAndReturnUser("expense", [
      "read",
    ]);
    const gymId = currentMember.organizationId;

    const now = new Date();
    const last12MonthsStart = startOfMonth(subMonths(now, 11));

    const [payments, expenses] = await Promise.all([
      prisma.payment.findMany({
        where: {
          gymId,
          paymentReceivedDate: { gte: last12MonthsStart },
        },
        select: {
          amountPaid: true,
          paymentReceivedDate: true,
        },
      }),

      prisma.expense.findMany({
        where: {
          gymId,
          expenseDate: { gte: last12MonthsStart },
        },
        select: {
          amount: true,
          expenseDate: true,
        },
      }),
    ]);

    const revenueByMonth: Record<string, number> = {};

    payments.forEach((p) => {
      const key = formatDate(p.paymentReceivedDate);
      revenueByMonth[key] = (revenueByMonth[key] || 0) + p.amountPaid;
    });

    const expensesByMonth: Record<string, number> = {};

    expenses.forEach((e) => {
      const key = formatDate(e.expenseDate);
      expensesByMonth[key] = (expensesByMonth[key] || 0) + e.amount;
    });

    const months: string[] = [];

    for (let i = 11; i >= 0; i--) {
      months.push(formatDate(startOfMonth(subMonths(now, i))));
    }

    const monthlyTrend = months.map((month) => ({
      month,
      revenue: revenueByMonth[month] ?? 0,
      expenses: expensesByMonth[month] ?? 0,
    }));

    return monthlyTrend;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

export const getExpenseCategoryPieData = cache(async () => {
  try {
    const currentMember = await requirePermissionAndReturnUser("expense", [
      "read",
    ]);
    const gymId = currentMember.organizationId;

    const now = new Date();
    const startOfYearDate = startOfYear(now);

    const expenses = await prisma.expense.findMany({
      where: {
        gymId,
        expenseDate: { gte: startOfYearDate },
      },
      select: {
        amount: true,
        category: true,
      },
    });

    const categoryMap: Record<string, number> = {};

    expenses.forEach((expense) => {
      categoryMap[expense.category] =
        (categoryMap[expense.category] || 0) + expense.amount;
    });

    const categoryPie = Object.entries(categoryMap).map(
      ([category, amount]) => ({
        category,
        amount,
      }),
    );

    return categoryPie;
  } catch (error) {
    console.error(error);
  }
});

export const getRevenueVsExpensesChartData = cache(async () => {
  try {
    const currentMember = await requirePermissionAndReturnUser("expense", [
      "read",
    ]);
    const gymId = currentMember.organizationId;

    const now = new Date();
    const currentMonthStartDate = startOfMonth(now);
    const currentMonthEndDate = endOfMonth(now);

    const [revenueAgg, expenseAgg] = await Promise.all([
      prisma.payment.aggregate({
        where: {
          gymId,
          paymentReceivedDate: {
            gte: currentMonthStartDate,
            lte: currentMonthEndDate,
          },
        },
        _sum: { amountPaid: true },
      }),

      prisma.expense.aggregate({
        where: {
          gymId,
          expenseDate: {
            gte: currentMonthStartDate,
            lte: currentMonthEndDate,
          },
        },
        _sum: { amount: true },
      }),
    ]);

    const revenue = revenueAgg._sum.amountPaid ?? 0;
    const expenses = expenseAgg._sum.amount ?? 0;

    const revenueVsExpenses = [
      { type: "Revenue", amount: revenue },
      { type: "Expenses", amount: expenses },
    ];

    return revenueVsExpenses;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

export const getFixedVsVariableChartData = cache(async () => {
  try {
    const currentMember = await requirePermissionAndReturnUser("expense", [
      "read",
    ]);
    const gymId = currentMember.organizationId;

    const now = new Date();
    const currentMonthStartDate = startOfMonth(now);
    const currentMonthEndDate = endOfMonth(now);

    const expenses = await prisma.expense.findMany({
      where: {
        gymId,
        expenseDate: {
          gte: currentMonthStartDate,
          lte: currentMonthEndDate,
        },
      },
      select: {
        amount: true,
        expenseNature: true,
      },
    });

    let fixed = 0;
    let variable = 0;

    expenses.forEach((expense) => {
      if (expense.expenseNature === "FIXED") fixed += expense.amount;
      if (expense.expenseNature === "VARIABLE") variable += expense.amount;
    });

    const fixedVariableChart = [
      { type: "Fixed", amount: fixed },
      { type: "Variable", amount: variable },
    ];

    return fixedVariableChart;
  } catch (error) {
    console.error(error);
  }
});

export const getUpcomingRecurringExpenses = cache(async () => {
  try {
    const currentMember = await requirePermissionAndReturnUser("expense", [
      "read",
    ]);
    const gymId = currentMember.organizationId;

    const now = new Date();
    const next30Days = addDays(now, 30);

    const upcomingExpenses = await prisma.expense.findMany({
      where: {
        gymId,
        isRecurring: true,
        nextDueDate: {
          gte: now,
          lte: next30Days,
        },
      },
      select: {
        id: true,
        title: true,
        amount: true,
        nextDueDate: true,
        recurringInterval: true,
        vendorName: true,
      },
      orderBy: {
        nextDueDate: "asc",
      },
    });

    const totalUpcomingAmount = upcomingExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );

    return {
      totalUpcomingAmount,
      upcomingExpenses,
    };
  } catch (error) {
    console.error(error);
  }
});
