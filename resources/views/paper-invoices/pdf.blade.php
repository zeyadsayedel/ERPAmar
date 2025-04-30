<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Paper Invoice #{{ $paperInvoice->id }}</title>
    <style>
        @font-face {
            font-family: 'DejaVuSans';
            src: url("{{ public_path('fonts/DejaVuSans.ttf') }}");
            font-weight: normal;
            font-style: normal;
        }
        body {
            font-family: 'DejaVuSans', sans-serif;
            direction: rtl;
            padding: 20px;
        }
        .logo {
            text-align: center;
            margin-bottom: 20px;
        }
        .logo img {
            width: 150px;
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
            width: 70%;
            margin-left: auto;
            margin-right: auto;
        }
        .page-break {
            page-break-after: always;
        }
    </style>
</head>
<body>
    <div class="logo">
        <img src="{{ public_path('logo.png') }}" alt="Company Logo">
    </div>
    
    <div class="header-info">
        المحجر : {{ $paperInvoice->quarry->name }} التاريخ: {{ $paperInvoice->invoice_date->format('Y-m-d') }}
    </div>
    
    <!-- Items Table -->
    <table>
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
            @if(count($paperInvoice->items) > 0)
                @foreach($paperInvoice->items as $item)
                    <tr>
                        @if($item->number > 0)
                            <td>{{ $item->number }}</td>
                        @endif
                        
                        @if($item->from)
                            <td>{{ $item->from }}</td>
                        @endif
                        
                        @if($item->to)
                            <td>{{ $item->to }}</td>
                        @elseif($item->from)
                            <td></td>
                        @endif
                        
                        @if($item->meters > 0)
                            <td>{{ $item->meters }}</td>
                        @endif
                        
                        <td>{{ $item->client_type ?? '-' }}</td>
                        
                        @if($item->revenue > 0)
                            <td>{{ $item->revenue }}</td>
                        @endif
                    </tr>
                @endforeach
            @else
                <tr>
                    <td colspan="6" style="text-align: center;">No items found</td>
                </tr>
            @endif
        </tbody>
    </table>
    
    <!-- Expenses Table -->
    <table>
        <thead>
            <tr>
                <th colspan="3">المصروفات</th>
                <th colspan="3">البيان</th>
            </tr>
        </thead>
        <tbody>
            @if(count($paperInvoice->items) > 0)
                @foreach($paperInvoice->items as $item)
                    @if($item->expenses > 0 || $item->statement)
                        <tr>
                            @if($item->expenses > 0)
                                <td colspan="3">{{ $item->expenses }}</td>
                            @endif
                            
                            @if($item->statement)
                                <td colspan="3">{{ $item->statement }}</td>
                            @endif
                        </tr>
                    @endif
                @endforeach
            @else
                <tr>
                    <td colspan="6" style="text-align: center;">No expenses found</td>
                </tr>
            @endif
        </tbody>
    </table>
    
    <!-- Summary Table -->
    <table class="summary-table">
        <tbody>
            <tr>
                <th>اجمالي العدد</th>
                <td>{{ $paperInvoice->total_count }}</td>
            </tr>
            <tr>
                <th>اجمالي الامتار</th>
                <td>{{ $paperInvoice->total_meters }}</td>
            </tr>
            <tr>
                <th>اجمالي الايرادات</th>
                <td>{{ $paperInvoice->total_revenue }}</td>
            </tr>
            <tr>
                <th>اجمالي المصروفات</th>
                <td>{{ $paperInvoice->total_expenses }}</td>
            </tr>
            <tr>
                <th>الصافي</th>
                <td>{{ $paperInvoice->total_net }}</td>
            </tr>
        </tbody>
    </table>

    <div style="text-align: center; font-size: 12px; margin-top: 30px;">
        تم إنشاء هذا التقرير بواسطة: {{ $paperInvoice->user->name ?? 'النظام' }} - {{ now()->format('Y-m-d H:i') }}
    </div>
</body>
</html>
