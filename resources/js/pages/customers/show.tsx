import { ReadOnlyField } from '@/components/form/read-only-field';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { formateDateDetail } from '@/lib/date-formatter';
import { BreadcrumbItem } from '@/types';
import { Customer } from '@/types/customers';
import { Product } from '@/types/product';
import { Head, Link, usePage } from '@inertiajs/react';
import { ExternalLinkIcon } from 'lucide-react';

interface CustomerServiceWithProduct {
    id: number;
    customer_id: number;
    product_id: number;
    start_date: string;
    end_date: string | null;
    product: Product;
}

interface CustomerWithDetails extends Customer {
    services: CustomerServiceWithProduct[];
}

interface PageProps {
    customer: CustomerWithDetails;
    canApprove?: boolean;
    [key: string]: unknown; // Add index signature to satisfy Inertia's PageProps constraint
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Customers',
        href: '/customers',
    },
    {
        title: 'Details',
        href: '/customers/show',
    },
];

const CustomerShow = () => {
    const { customer } = usePage<PageProps>().props;

    const created_at = formateDateDetail(customer.created_at);
    const updated_at = formateDateDetail(customer.updated_at);
    const registration_date = formateDateDetail(customer.registration_date);

    // Function to get status badge color
    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-500';
            case 'inactive':
                return 'bg-gray-500';
            case 'suspended':
                return 'bg-amber-500';
            case 'cancelled':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Customer: ${customer.name}`} />
            
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {/* Customer Details */}
                    <div className="space-y-4 rounded-lg bg-white p-6 shadow">
                        <h2 className="border-b pb-2 text-lg font-semibold">Customer Information</h2>

                        <ReadOnlyField label="Customer ID" value={`#${customer.id}`} />
                        <ReadOnlyField label="Name" value={customer.name} />
                        <div className="mt-2 flex items-center">
                        <span className="mr-2 text-l">Status :</span>
                        <span className={`rounded-full px-3 py-1 text-xs font-medium text-white ${getStatusBadgeClass(customer.status)}`}>
                            {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                        </span>
                    </div>
                        <ReadOnlyField label="Address" value={customer.address || 'No address provided'} />
                        <ReadOnlyField label="Registration Date" value={registration_date} />

                        {customer.project && (
                            <div>
                                <Label className="text-base font-medium">Associated Project:</Label>
                                <div className="mt-1 flex items-center">
                                    <Link
                                        href={route('projects.show', customer.project.id)}
                                        className="flex items-center text-blue-600 hover:text-blue-800"
                                    >
                                        Project #{customer.project.id}
                                        <ExternalLinkIcon className="ml-1 h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        )}

                        <Separator className="my-4" />

                        <ReadOnlyField label="Created At" value={created_at} />
                        <ReadOnlyField label="Updated At" value={updated_at} />
                    </div>

                    {/* Services Information */}
                    <div className="rounded-lg bg-white p-6 shadow">
                        <h2 className="border-b pb-2 text-lg font-semibold">Services</h2>

                        {customer.services && customer.services.length > 0 ? (
                            <div className="mt-4 space-y-6">
                                {customer.services.map((service) => (
                                    <div key={service.id} className="rounded-md border p-4 hover:bg-gray-50">
                                        <div className="flex justify-between">
                                            <h3 className="font-medium">{service.product.name}</h3>
                                            <p className="text-sm text-gray-500">ID: #{service.id}</p>
                                        </div>

                                        <div className="mt-2 grid grid-cols-2 gap-2">
                                            <div>
                                                <p className="text-sm text-gray-500">Start Date</p>
                                                <p>{formateDateDetail(service.start_date)}</p>
                                            </div>

                                            <div>
                                                <p className="text-sm text-gray-500">End Date</p>
                                                <p>{service.end_date ? formateDateDetail(service.end_date) : 'Ongoing'}</p>
                                            </div>

                                            <div className="col-span-2">
                                                <p className="text-sm text-gray-500">Price</p>
                                                <p className="font-medium">${service.product.price}</p>
                                            </div>

                                            {service.product.speed && (
                                                <div className="col-span-2">
                                                    <p className="text-sm text-gray-500">Speed</p>
                                                    <p>{service.product.speed}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-8 text-center text-gray-500">
                                <p>No services have been added for this customer.</p>
                                <p className="mt-2 text-sm">
                                    <Link href={route('customers.edit', customer.id)} className="text-blue-600 hover:underline">
                                        Click here
                                    </Link>{' '}
                                    to add services.
                                </p>
                            </div>
                        )}

                        <div className="mt-6">
                            <Label className="text-base font-medium">Total Services:</Label>
                            <div className="mt-1 text-xl font-bold">{customer.services?.length || 0}</div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default CustomerShow;
