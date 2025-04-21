import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pencil, Package, Truck, FileText } from 'lucide-react';
import { CustomerAccount } from '@/types/customer-account';
import { PermissionChecker } from '@/components/Permission';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface Props {
  customer: CustomerAccount;
  permissions: Record<string, boolean>;
}

export default function Show({ customer }: Props) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <AppLayout>
      <Head title={customer.name} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center">
            <Button variant="outline" onClick={() => router.visit(route('customer-accounts.index'))} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Customers
            </Button>
            <PermissionChecker permission="customer_account:update">
              <Button variant="outline" onClick={() => router.visit(route('customer-accounts.edit', customer.id))}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit Customer
              </Button>
            </PermissionChecker>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{customer.name}</CardTitle>
              {customer.client_type && (
                <Badge variant="outline" className="ml-2">
                  {customer.client_type}
                </Badge>
              )}
              {customer.walk_in_customer && (
                <Badge className="ml-2">
                  Walk-in Customer
                </Badge>
              )}
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              </div>

              
              <Tabs defaultValue="pricing" className="mt-8">
                <TabsList>
                  <TabsTrigger value="pricing">Pricing</TabsTrigger>
                  <TabsTrigger value="quarries">
                    <Package className="h-4 w-4 mr-2" />
                    Quarries ({customer.quarries?.length || 0})
                  </TabsTrigger>
                  <TabsTrigger value="contractors">
                    <Truck className="h-4 w-4 mr-2" />
                    Contractors ({customer.contractors?.length || 0})
                  </TabsTrigger>
                  <TabsTrigger value="invoices">
                    <FileText className="h-4 w-4 mr-2" />
                    Invoices ({customer.invoices?.length || 0})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="pricing">
                  <div className="rounded-md border mt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Material</TableHead>
                          <TableHead>Base Price</TableHead>
                          <TableHead>Tractor</TableHead>
                          <TableHead>Trilla</TableHead>
                          <TableHead>Faradani</TableHead>
                          <TableHead>Faradani Double</TableHead>
                          <TableHead>Farm Tractor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Sand</TableCell>
                          <TableCell>{formatCurrency(customer.sand_price)}</TableCell>
                          <TableCell>{formatCurrency(customer.tractor_sand_price)}</TableCell>
                          <TableCell>{formatCurrency(customer.trilla_sand_price)}</TableCell>
                          <TableCell>{formatCurrency(customer.faradani_sand_price)}</TableCell>
                          <TableCell>{formatCurrency(customer.faradani_double_sand_price)}</TableCell>
                          <TableCell>{formatCurrency(customer.farm_tractor_sand_price)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Soil</TableCell>
                          <TableCell>{formatCurrency(customer.soil_price)}</TableCell>
                          <TableCell>{formatCurrency(customer.tractor_soil_price)}</TableCell>
                          <TableCell>{formatCurrency(customer.trilla_soil_price)}</TableCell>
                          <TableCell>{formatCurrency(customer.faradani_soil_price)}</TableCell>
                          <TableCell>{formatCurrency(customer.faradani_double_soil_price)}</TableCell>
                          <TableCell>{formatCurrency(customer.farm_tractor_soil_price)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Zalat</TableCell>
                          <TableCell>{formatCurrency(customer.zalat_price)}</TableCell>
                          <TableCell>{formatCurrency(customer.tractor_zalat_price)}</TableCell>
                          <TableCell>{formatCurrency(customer.trilla_zalat_price)}</TableCell>
                          <TableCell>{formatCurrency(customer.faradani_zalat_price)}</TableCell>
                          <TableCell>{formatCurrency(customer.faradani_double_zalat_price)}</TableCell>
                          <TableCell>{formatCurrency(customer.farm_tractor_zalat_price)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Rubble</TableCell>
                          <TableCell>{formatCurrency(customer.rubble_price)}</TableCell>
                          <TableCell>{formatCurrency(customer.tractor_rubble_price)}</TableCell>
                          <TableCell>{formatCurrency(customer.trilla_rubble_price)}</TableCell>
                          <TableCell>{formatCurrency(customer.faradani_rubble_price)}</TableCell>
                          <TableCell>{formatCurrency(customer.faradani_double_rubble_price)}</TableCell>
                          <TableCell>{formatCurrency(customer.farm_tractor_rubble_price)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="quarries">
                  <div className="rounded-md border mt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {customer.quarries && customer.quarries.length > 0 ? (
                          customer.quarries.map((quarry) => (
                            <TableRow key={quarry.id}>
                              <TableCell className="font-medium">{quarry.name}</TableCell>
                              <TableCell>{quarry.location || '-'}</TableCell>
                              <TableCell>{quarry.type || '-'}</TableCell>
                              <TableCell>
                                {quarry.status && (
                                  <Badge variant={quarry.status === 'active' ? 'default' : 'outline'}>
                                    {quarry.status}
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => router.visit(route('quarries.show', quarry.id))}
                                >
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                              No quarries associated with this customer.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="contractors">
                  <div className="rounded-md border mt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Contact Person</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {customer.contractors && customer.contractors.length > 0 ? (
                          customer.contractors.map((contractor) => (
                            <TableRow key={contractor.id}>
                              <TableCell className="font-medium">{contractor.name}</TableCell>
                              <TableCell>{contractor.contact_person || '-'}</TableCell>
                              <TableCell>{contractor.phone || '-'}</TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => router.visit(route('car-contractors.show', contractor.id))}
                                >
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                              No contractors associated with this customer.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="invoices">
                  <div className="rounded-md border mt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Invoice #</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {customer.invoices && customer.invoices.length > 0 ? (
                          customer.invoices.map((invoice) => (
                            <TableRow key={invoice.id}>
                              <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                              <TableCell>{formatDate(invoice.date)}</TableCell>
                              <TableCell>{formatCurrency(invoice.total_amount)}</TableCell>
                              <TableCell>
                                <Badge 
                                  variant={
                                    invoice.status === 'paid' ? 'default' :
                                    invoice.status === 'pending' ? 'outline' : 'destructive'
                                  }
                                >
                                  {invoice.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => router.visit(route('invoices.show', invoice.id))}
                                >
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                              No invoices associated with this customer.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>

            <CardFooter className="border-t bg-gray-50 text-xs text-gray-500 flex justify-between">
              <span>Created: {formatDate(customer.created_at)}</span>
              <span>Last Updated: {formatDate(customer.updated_at)}</span>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}