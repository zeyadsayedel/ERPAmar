import React, { useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PaperInvoice, PaperInvoiceItem } from '@/types/paper-invoice';


interface Props {
    paperInvoice: PaperInvoice;
    quarries: { id: number; name: string }[];
    users: { id: number; name: string }[];
}



interface FormData {
    quarry_id: string;
    invoice_date: string;
    user_id: string;
    items: PaperInvoiceItem[];
    [key: string]: any; // Allow additional properties for dynamic form fields
}

export default function Edit({ paperInvoice, quarries }: Props) {
    const { data, setData, errors, put, processing } = useForm<FormData>({
        quarry_id: paperInvoice.quarry_id.toString(),
        invoice_date: paperInvoice.invoice_date,
        user_id: paperInvoice.user_id ? paperInvoice.user_id.toString() : '',
        items: [],
    });



    useEffect(() => {
        // Initialize items from the paperInvoice
        if (paperInvoice.items && paperInvoice.items.length > 0) {
            const formattedItems = paperInvoice.items.map((item: PaperInvoiceItem) => ({
                id: item.id,
                paper_invoice_id: item.paper_invoice_id,
                number: item.number,
                from: item.from || '',
                to: item.to || '',
                meters: item.meters,
                client_type: item.client_type || '',
                revenue: item.revenue,
                expenses: item.expenses,
                statement: item.statement || '',
            }));
            setData('items', formattedItems);
        } else {
            setData('items', [createEmptyItem()]);
        }
    }, [paperInvoice]);

    function createEmptyItem(): PaperInvoiceItem {
        return {
            id: null,
            paper_invoice_id: paperInvoice.id,
            number: 0,
            from: '',
            to: '',
            meters: 0,
            client_type: '',
            revenue: 0,
            expenses: 0,
            statement: '',
        };
    }

    // Format date for the input field
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    };

    console.log('data', formatDate(data.invoice_date));

    const addItem = () => {
        setData('items', [...data.items, createEmptyItem()]);
    };

    const removeItem = (index: number) => {
        const updatedItems = [...data.items];
        updatedItems.splice(index, 1);
        setData('items', updatedItems);
    };

    const updateItem = (index: number, field: keyof PaperInvoiceItem, value: string | number) => {
        const updatedItems = [...data.items];
        updatedItems[index] = { ...updatedItems[index], [field]: value };
        setData('items', updatedItems);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('paper-invoices.update', paperInvoice.id));
    };

    // Calculate totals
    const totals = data.items.reduce(
        (acc, item: PaperInvoiceItem) => {
            const meters = item.meters || 0;
            const revenue = item.revenue || 0;
            const expenses = item.expenses || 0;

            return {
                totalMeters: acc.totalMeters + meters,
                totalRevenue: acc.totalRevenue + revenue,
                totalExpenses: acc.totalExpenses + expenses,
                totalNet: acc.totalNet + revenue - expenses,
            };
        },
        { totalMeters: 0, totalRevenue: 0, totalExpenses: 0, totalNet: 0 }
    );

    return (
        <AppLayout>
            <Head title="Edit Paper Invoice" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900">Edit Paper Invoice #{paperInvoice.id}</h1>
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                        >
                            Back
                        </button>
                    </div>

                    <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                        <form onSubmit={handleSubmit}>
                            {/* Invoice Header */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Quarry</label>
                                    <select
                                        value={data.quarry_id}
                                        onChange={(e) => setData('quarry_id', e.target.value)}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                    >
                                        <option value="">Select Quarry</option>
                                        {quarries.map((quarry) => (
                                            <option key={quarry.id} value={quarry.id}>
                                                {quarry.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.quarry_id && <div className="text-red-500 text-sm mt-1">{errors.quarry_id}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Invoice Date</label>
                                    <input
                                        type="date"
                                        value={formatDate(data.invoice_date)}
                                        onChange={(e) => setData('invoice_date', e.target.value)}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                    />
                                    {errors.invoice_date && <div className="text-red-500 text-sm mt-1">{errors.invoice_date}</div>}
                                </div>

                                
                            </div>

                            {/* Items Table */}
                            <div className="mb-6">
                                <h2 className="text-lg font-medium text-gray-900 mb-4">Invoice Items</h2>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Number
                                                </th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    From
                                                </th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    To
                                                </th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Meters
                                                </th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Client Type
                                                </th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Revenue
                                                </th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Expenses
                                                </th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Statement
                                                </th>
                                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {data.items.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="px-3 py-4 whitespace-nowrap">
                                                        <input
                                                            type="number"
                                                            value={item.number}
                                                            onChange={(e) => updateItem(index, 'number', Number.parseInt(e.target.value))}
                                                            className="block w-20 border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                                        />
                                                        {errors[`items.${index}.number`] && (
                                                            <div className="text-red-500 text-sm mt-1">{errors[`items.${index}.number`]}</div>
                                                        )}
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap">
                                                        <input
                                                            type="text"
                                                            value={item.from || ''}
                                                            onChange={(e) => updateItem(index, 'from', e.target.value)}
                                                            className="block w-24 border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                                        />
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap">
                                                        <input
                                                            type="text"
                                                            value={item.to || ''}
                                                            onChange={(e) => updateItem(index, 'to', e.target.value)}
                                                            className="block w-24 border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                                        />
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap">
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            value={item.meters || 0}
                                                            onChange={(e) => updateItem(index, 'meters', Number.parseFloat(e.target.value))}
                                                            className="block w-24 border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                                        />
                                                        {errors[`items.${index}.meters`] && (
                                                            <div className="text-red-500 text-sm mt-1">{errors[`items.${index}.meters`]}</div>
                                                        )}
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap">
                                                        <input
                                                            type="text"
                                                            value={item.client_type || ''}
                                                            onChange={(e) => updateItem(index, 'client_type', e.target.value)}
                                                            className="block w-24 border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                                        />
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap">
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            value={item.revenue || 0}
                                                            onChange={(e) => updateItem(index, 'revenue', Number.parseFloat(e.target.value))}
                                                            className="block w-24 border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                                        />
                                                        {errors[`items.${index}.revenue`] && (
                                                            <div className="text-red-500 text-sm mt-1">{errors[`items.${index}.revenue`]}</div>
                                                        )}
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap">
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            value={item.expenses || 0}
                                                            onChange={(e) => updateItem(index, 'expenses', Number.parseFloat(e.target.value))}
                                                            className="block w-24 border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                                        />
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap">
                                                        <input
                                                            type="text"
                                                            value={item.statement || ''}
                                                            onChange={(e) => updateItem(index, 'statement', e.target.value)}
                                                            className="block w-32 border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                                        />
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap text-right">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeItem(index)}
                                                            className="text-red-600 hover:text-red-900"
                                                            disabled={data.items.length === 1}
                                                        >
                                                            Remove
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colSpan={9} className="px-3 py-4">
                                                    <button
                                                        type="button"
                                                        onClick={addItem}
                                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                                    >
                                                        Add Item
                                                    </button>
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                                {errors.items && <div className="text-red-500 text-sm mt-1">{errors.items}</div>}
                            </div>

                            {/* Summary */}
                            <div className="mb-6 mt-4 border-t pt-4">
                                <h2 className="text-lg font-medium text-gray-900 mb-2">Invoice Summary</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="border rounded p-3 bg-gray-50">
                                        <div className="text-sm text-gray-500">Total Meters</div>
                                        <div className="text-xl font-bold">{totals?.totalMeters?.toFixed(2)}</div>
                                    </div>
                                    <div className="border rounded p-3 bg-gray-50">
                                        <div className="text-sm text-gray-500">Total Revenue</div>
                                        <div className="text-xl font-bold">{totals.totalRevenue.toFixed(2)}</div>
                                    </div>
                                    <div className="border rounded p-3 bg-gray-50">
                                        <div className="text-sm text-gray-500">Total Expenses</div>
                                        <div className="text-xl font-bold">{totals.totalExpenses.toFixed(2)}</div>
                                    </div>
                                    <div className="border rounded p-3 bg-gray-50">
                                        <div className="text-sm text-gray-500">Net Total</div>
                                        <div className="text-xl font-bold">{totals.totalNet.toFixed(2)}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex items-center justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {processing ? 'Updating...' : 'Update Invoice'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
