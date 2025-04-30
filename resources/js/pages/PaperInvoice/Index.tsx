import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { format } from 'date-fns';

import { PaperInvoice } from '@/types/paper-invoice';
import { PaginationProps } from '@/types/pagination';
import AppLayout from '@/layouts/app-layout';

interface Props {
  invoices: PaginationProps<PaperInvoice>;
  filters: {
    search: string;
    quarry_id: number | null;
    from_date: string | null;
    to_date: string | null;
  };
  quarries: { id: number; name: string }[];
}

export default function Index({ invoices, filters, quarries }: Props) {
  const [search, setSearch] = useState(filters.search || '');
  const [quarryId, setQuarryId] = useState<number | string>(filters.quarry_id || '');
  const [fromDate, setFromDate] = useState(filters.from_date || '');
  const [toDate, setToDate] = useState(filters.to_date || '');

  const handleFilter = () => {
    router.get(
      route('paper-invoices.index'),
      {
        search,
        quarry_id: quarryId || undefined,
        from_date: fromDate || undefined,
        to_date: toDate || undefined,
      },
      {
        preserveState: true,
        replace: true,
      }
    );
  };

  const handleReset = () => {
    setSearch('');
    setQuarryId('');
    setFromDate('');
    setToDate('');
    router.get(route('paper-invoices.index'), {}, { preserveState: true });
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      router.delete(route('paper-invoices.destroy', id));
    }
  };

  return (
    <AppLayout>
      <Head title="Paper Invoices" />

      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Paper Invoices</h1>
            <Link
              href={route('paper-invoices.create')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create New Invoice
            </Link>
          </div>

          {/* Filter Form */}
          <div className="bg-white shadow rounded-md p-4 mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Search</label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                  placeholder="Search by quarry name or date"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Quarry</label>
                <select
                  value={quarryId}
                  onChange={(e) => setQuarryId(e.target.value ? Number(e.target.value) : '')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                >
                  <option value="">All Quarries</option>
                  {quarries.map((quarry) => (
                    <option key={quarry.id} value={quarry.id}>
                      {quarry.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">From Date</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">To Date</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                />
              </div>

              <div className="flex items-end space-x-2">
                <button
                  onClick={handleFilter}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Filter
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Invoices Table */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quarry
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Meters
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expenses
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.data.map((invoice: PaperInvoice) => (
                  <tr key={invoice.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(invoice.invoice_date), 'yyyy-MM-dd')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice?.quarry?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.total_meters}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.total_revenue}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.total_expenses}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.total_net}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={route('paper-invoices.show', invoice.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View
                        </Link>
                        <Link
                          href={route('paper-invoices.edit', invoice.id)}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(invoice.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                        <Link
                          href={route('paper-invoices.print', invoice.id)}
                          className="text-green-600 hover:text-green-900"
                          target="_blank"
                        >
                          Print
                        </Link>
                        <Link
                          href={route('paper-invoices.pdf', invoice.id)}
                          className="text-blue-600 hover:text-blue-900"
                          target="_blank"
                        >
                          PDF
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}

                {invoices.data.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">No invoices found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex justify-between">
            {invoices.links && (
              <div className="flex flex-1 justify-between">
                {invoices.links.prev && (
                  <Link href={invoices.links.prev} className="px-4 py-2 border rounded hover:bg-gray-100">
                    Previous
                  </Link>
                )}
                {invoices.links.next && (
                  <Link href={invoices.links.next} className="px-4 py-2 border rounded hover:bg-gray-100">
                    Next
                  </Link>
                )}
              </div>
            )}

            <div className="text-sm text-gray-700">
              Showing {invoices.from} to {invoices.to} of {invoices.total} invoices
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
