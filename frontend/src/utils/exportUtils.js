import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Export table data to PDF
export const exportToPDF = (title, headers, data, fileName, companyName) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 20);
  
  // Add company and date
  doc.setFontSize(11);
  if (companyName) {
    doc.text(`Company: ${companyName}`, 14, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 36);
  } else {
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);
  }

  // Add table
  doc.autoTable({
    head: [headers],
    body: data,
    startY: companyName ? 42 : 36,
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 'auto' }
    }
  });

  doc.save(`${fileName}.pdf`);
};

// Export table data to Excel
export const exportToExcel = (title, headers, data, fileName, companyName) => {
  // Prepare worksheet data
  const wsData = [];
  
  // Add title
  wsData.push([title]);
  wsData.push([]);
  
  // Add company and date info
  if (companyName) {
    wsData.push([`Company: ${companyName}`]);
  }
  wsData.push([`Date: ${new Date().toLocaleDateString()}`]);
  wsData.push([]);
  
  // Add headers
  wsData.push(headers);
  
  // Add data rows
  data.forEach(row => {
    wsData.push(row);
  });

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Set column widths
  const colWidths = headers.map(() => ({ wch: 20 }));
  ws['!cols'] = colWidths;

  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, title.substring(0, 31)); // Excel sheet name limit

  // Generate Excel file
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${fileName}.xlsx`);
};

// Export ledger details to PDF
export const exportLedgerDetailsToPDF = (ledgerName, transactions, openingBalance, closingBalance, companyName) => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text('Ledger Details', 14, 20);
  
  doc.setFontSize(12);
  doc.text(`Ledger: ${ledgerName}`, 14, 30);
  if (companyName) {
    doc.text(`Company: ${companyName}`, 14, 36);
  }
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 42);

  // Opening balance
  doc.setFontSize(10);
  doc.text(`Opening Balance: ₹${openingBalance.toFixed(2)}`, 14, 52);

  // Transactions table
  const tableData = transactions.map(txn => [
    new Date(txn.date).toLocaleDateString(),
    txn.voucherNumber || '-',
    txn.particulars || '-',
    txn.debit > 0 ? `₹${txn.debit.toFixed(2)}` : '-',
    txn.credit > 0 ? `₹${txn.credit.toFixed(2)}` : '-',
    `₹${(txn.balance || 0).toFixed(2)}`
  ]);

  doc.autoTable({
    head: [['Date', 'Voucher No.', 'Particulars', 'Debit', 'Credit', 'Balance']],
    body: tableData,
    startY: 58,
    theme: 'grid',
    headStyles: { fillColor: [52, 73, 94], textColor: 255 },
    styles: { fontSize: 8 }
  });

  // Closing balance
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text(`Closing Balance: ₹${closingBalance.toFixed(2)}`, 14, finalY);

  doc.save(`${ledgerName.replace(/[^a-z0-9]/gi, '_')}_details.pdf`);
};

// Export ledger details to Excel
export const exportLedgerDetailsToExcel = (ledgerName, transactions, openingBalance, closingBalance, companyName) => {
  const wsData = [];
  
  wsData.push(['Ledger Details']);
  wsData.push([]);
  wsData.push([`Ledger: ${ledgerName}`]);
  if (companyName) {
    wsData.push([`Company: ${companyName}`]);
  }
  wsData.push([`Date: ${new Date().toLocaleDateString()}`]);
  wsData.push([]);
  wsData.push([`Opening Balance: ₹${openingBalance.toFixed(2)}`]);
  wsData.push([]);
  wsData.push(['Date', 'Voucher No.', 'Particulars', 'Debit', 'Credit', 'Balance']);
  
  transactions.forEach(txn => {
    wsData.push([
      new Date(txn.date).toLocaleDateString(),
      txn.voucherNumber || '-',
      txn.particulars || '-',
      txn.debit > 0 ? txn.debit.toFixed(2) : '-',
      txn.credit > 0 ? txn.credit.toFixed(2) : '-',
      (txn.balance || 0).toFixed(2)
    ]);
  });
  
  wsData.push([]);
  wsData.push(['Closing Balance:', '', '', '', '', closingBalance.toFixed(2)]);

  const ws = XLSX.utils.aoa_to_sheet(wsData);
  ws['!cols'] = [
    { wch: 15 }, { wch: 15 }, { wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 15 }
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Ledger Details');

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${ledgerName.replace(/[^a-z0-9]/gi, '_')}_details.xlsx`);
};
