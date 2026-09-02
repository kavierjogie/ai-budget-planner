'use client';

import { EXPENSE_CATEGORIES } from '@/types';
import { formatCurrency, getMonthYearLabel } from './utils';

interface ReportData {
  userName: string;
  monthYear: string;
  totalIncome: number;
  totalExpenses: number;
  amountSaved: number;
  budgetStatus: string;
  spendingByCategory: Record<string, number>;
  incomeItems: Array<{ source: string; amount: number; date: string }>;
  expenseItems: Array<{ description: string; category: string; amount: number; date: string }>;
  savingsGoals: Array<{ name: string; target_amount: number; current_amount: number }>;
  aiRecommendations: string[];
  currency: string;
}

export async function generatePDFReport(data: ReportData): Promise<void> {
  // Dynamic import to avoid SSR issues
  const jsPDF = (await import('jspdf')).default;
  const autoTable = (await import('jspdf-autotable')).default;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = 20;

  // Color palette
  const primaryColor: [number, number, number] = [99, 102, 241]; // Indigo
  const successColor: [number, number, number] = [34, 197, 94]; // Green
  const dangerColor: [number, number, number] = [239, 68, 68]; // Red
  const warningColor: [number, number, number] = [245, 158, 11]; // Amber
  const darkColor: [number, number, number] = [15, 23, 42]; // Slate-900
  const grayColor: [number, number, number] = [100, 116, 139]; // Slate-500

  // Header
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 50, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('AI Budget Planner', margin, 22);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Financial Report — ${getMonthYearLabel(data.monthYear)}`, margin, 35);
  doc.text(`Prepared for: ${data.userName}`, margin, 43);

  y = 65;

  // Budget status badge
  const statusColors: Record<string, [number, number, number]> = {
    overspent: dangerColor,
    on_budget: warningColor,
    under_budget: successColor,
  };
  const statusLabels: Record<string, string> = {
    overspent: 'OVERSPENT',
    on_budget: 'ON BUDGET',
    under_budget: 'UNDER BUDGET',
  };
  const statusColor = statusColors[data.budgetStatus] || grayColor;
  doc.setFillColor(...statusColor);
  doc.roundedRect(margin, y - 8, 60, 12, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(statusLabels[data.budgetStatus] || 'UNKNOWN', margin + 5, y);

  y += 12;

  // Financial Summary
  doc.setTextColor(...darkColor);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Financial Summary', margin, y);
  y += 8;

  const summaryData = [
    ['Total Income', formatCurrency(data.totalIncome, data.currency)],
    ['Total Expenses', formatCurrency(data.totalExpenses, data.currency)],
    ['Amount Saved', formatCurrency(data.amountSaved, data.currency)],
    ['Savings Rate', `${((data.amountSaved / data.totalIncome) * 100).toFixed(1)}%`],
  ];

  autoTable(doc, {
    startY: y,
    head: [['Metric', 'Amount']],
    body: summaryData,
    theme: 'striped',
    headStyles: { fillColor: primaryColor, textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: { 1: { halign: 'right', fontStyle: 'bold' } },
    margin: { left: margin, right: margin },
  });

  y = (doc as any).lastAutoTable.finalY + 15;

  // Spending by Category
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkColor);
  doc.text('Spending by Category', margin, y);
  y += 8;

  const categoryData = Object.entries(data.spendingByCategory)
    .sort(([, a], [, b]) => b - a)
    .map(([cat, amount]) => {
      const catInfo = EXPENSE_CATEGORIES.find(c => c.value === cat);
      return [
        catInfo?.label || cat,
        formatCurrency(amount, data.currency),
        `${((amount / data.totalExpenses) * 100).toFixed(1)}%`,
      ];
    });

  autoTable(doc, {
    startY: y,
    head: [['Category', 'Amount', '% of Total']],
    body: categoryData,
    theme: 'striped',
    headStyles: { fillColor: primaryColor, textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: { 1: { halign: 'right' }, 2: { halign: 'right' } },
    margin: { left: margin, right: margin },
  });

  y = (doc as any).lastAutoTable.finalY + 15;

  // Savings Goals
  if (data.savingsGoals.length > 0) {
    if (y > 220) { doc.addPage(); y = 20; }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkColor);
    doc.text('Savings Goals Progress', margin, y);
    y += 8;

    const goalsData = data.savingsGoals.map(goal => [
      goal.name,
      formatCurrency(goal.current_amount, data.currency),
      formatCurrency(goal.target_amount, data.currency),
      `${((goal.current_amount / goal.target_amount) * 100).toFixed(1)}%`,
    ]);

    autoTable(doc, {
      startY: y,
      head: [['Goal', 'Saved', 'Target', 'Progress']],
      body: goalsData,
      theme: 'striped',
      headStyles: { fillColor: [34, 197, 94], textColor: [255, 255, 255], fontStyle: 'bold' },
      columnStyles: { 1: { halign: 'right' }, 2: { halign: 'right' }, 3: { halign: 'right' } },
      margin: { left: margin, right: margin },
    });

    y = (doc as any).lastAutoTable.finalY + 15;
  }

  // Expense Details
  if (y > 200) { doc.addPage(); y = 20; }

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkColor);
  doc.text('Expense Details', margin, y);
  y += 8;

  const expenseData = data.expenseItems.slice(0, 30).map(exp => {
    const catInfo = EXPENSE_CATEGORIES.find(c => c.value === exp.category);
    return [exp.description, catInfo?.label || exp.category, formatCurrency(exp.amount, data.currency), exp.date];
  });

  autoTable(doc, {
    startY: y,
    head: [['Description', 'Category', 'Amount', 'Date']],
    body: expenseData,
    theme: 'striped',
    headStyles: { fillColor: primaryColor, textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: { 2: { halign: 'right' } },
    margin: { left: margin, right: margin },
  });

  y = (doc as any).lastAutoTable.finalY + 15;

  // AI Recommendations
  if (data.aiRecommendations.length > 0) {
    if (y > 220) { doc.addPage(); y = 20; }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkColor);
    doc.text('AI Recommendations', margin, y);
    y += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grayColor);

    data.aiRecommendations.forEach((rec, i) => {
      if (y > 270) { doc.addPage(); y = 20; }
      const lines = doc.splitTextToSize(`${i + 1}. ${rec}`, pageWidth - margin * 2 - 5);
      doc.text(lines, margin, y);
      y += lines.length * 6 + 3;
    });
  }

  // Footer
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...grayColor);
    doc.text(
      `AI Budget Planner • Generated ${new Date().toLocaleDateString()} • Page ${i} of ${totalPages}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  doc.save(`budget-report-${data.monthYear}.pdf`);
}
