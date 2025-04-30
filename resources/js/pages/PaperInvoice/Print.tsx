import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { PaperInvoice, PaperInvoiceItem } from '@/types/paper-invoice';

export default function Print({ paperInvoice }: {paperInvoice: PaperInvoice}) {
  // Auto-print when component mounts
  useEffect(() => {
    setTimeout(() => {
      window.print();
    }, 500);
  }, []);

  return (
    <div dir="rtl" lang="ar" className="print-container">
      <Head title={`Invoice #${paperInvoice.id}`} />

      <style>{`
        @media print {
          body {
            direction: rtl;
            font-family: Arial, Tahoma, sans-serif;
          }
          .no-print {
            display: none;
          }
          .print-container {
            width: 100%;
            margin: 0;
            padding: 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid #000;
            padding: 8px;
            text-align: center;
          }
          th {
            background-color: #f2f2f2;
          }
          .logo {
            text-align: center;
            margin-bottom: 20px;
          }
          .header-info {
            text-align: center;
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 20px;
          }
          .summary-table {
            margin-top: 20px;
            width: 50%;
            margin-left: auto;
            margin-right: auto;
          }
        }
        
        /* Non-print styles */
        body {
          direction: rtl;
          font-family: Arial, Tahoma, sans-serif;
        }
        .print-container {
          max-width: 800px;
          margin: 20px auto;
          padding: 20px;
          border: 1px solid #ccc;
        }
        .logo {
          text-align: center;
          margin-bottom: 20px;
        }
        .logo img {
          width: 180px;
        }
        .header-info {
          text-align: center;
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 20px;
          background-color: #f2f2f2;
          padding: 10px;
          border-radius: 5px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          border: 1px solid #000;
          padding: 8px;
          text-align: center;
        }
        th {
          background-color: #f2f2f2;
        }
        .summary-table {
          margin-top: 20px;
          width: 50%;
          margin-left: auto;
          margin-right: auto;
        }
        .no-print {
          text-align: center;
          margin-top: 20px;
        }
        .no-print button {
          background-color: #4CAF50;
          color: white;
          padding: 10px 15px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin-right: 10px;
        }
      `}</style>
      
      <div id="pdf">
        <div className="logo">
          <img width="180" src="/logo.png" alt="Company Logo" />
        </div>
        
        <div className="header-info">
          المحجر : {paperInvoice.quarry?.name} التاريخ: {format(new Date(paperInvoice.invoice_date), 'yyyy-MM-dd')}
        </div>
        
        {/* Items Table */}
        <table className="print_daily_invoice">
          <thead>
            <tr>
              <th>العدد</th>
              <th>من</th>
              <th>الي</th>
              <th>الامتار</th>
              <th>نوع العميل</th>
              <th>الايرادات</th>
            </tr>
          </thead>
          <tbody>
            {paperInvoice.items && paperInvoice.items.length > 0 ? (
              paperInvoice.items.map((item: PaperInvoiceItem) => (
                <tr key={item.id}>
                  {item.number > 0 && <td>{item.number}</td>}
                  {item.from && <td>{item.from}</td>}
                  {item.to ? <td>{item.to}</td> : (item.from ? <td></td> : null)}
                  {item.meters > 0 && <td>{item.meters}</td>}
                  <td>{item.client_type || '-'}</td>
                  {item.revenue > 0 && <td>{item.revenue}</td>}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center">No items found</td>
              </tr>
            )}
          </tbody>
        </table>
        
        {/* Expenses Table */}
        <table className="print_daily_invoice">
          <thead>
            <tr>
              <th colSpan={3}>المصروفات</th>
              <th colSpan={3}>البيان</th>
            </tr>
          </thead>
          <tbody>
            {paperInvoice.items && paperInvoice.items.length > 0 ? (
              paperInvoice.items.map((item: PaperInvoiceItem) => (
                item.expenses > 0 || item.statement ? (
                  <tr key={`expense-${item.id}`}>
                    {item.expenses > 0 && <td colSpan={3}>{item.expenses}</td>}
                    {item.statement && <td colSpan={3}>{item.statement}</td>}
                  </tr>
                ) : null
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center">No expenses found</td>
              </tr>
            )}
          </tbody>
        </table>
        
        {/* Summary Table */}
        <table className="print_daily_invoice summary-table">
          <tbody>
            <tr>
              <th>اجمالي العدد</th>
              <td>{paperInvoice.total_count}</td>
            </tr>
            <tr>
              <th>اجمالي الامتار</th>
              <td>{paperInvoice.total_meters}</td>
            </tr>
            <tr>
              <th>اجمالي الايرادات</th>
              <td>{paperInvoice.total_revenue}</td>
            </tr>
            <tr>
              <th>اجمالي المصروفات</th>
              <td>{paperInvoice.total_expenses}</td>
            </tr>
            <tr>
              <th>الصافي</th>
              <td>{paperInvoice.total_net}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="no-print">
        <button onClick={() => window.print()}>طباعة</button>
        <button onClick={() => window.history.back()}>العودة</button>
      </div>
    </div>
  );
}
