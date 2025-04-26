import { DataTable } from '@/components/table/data-table';
import { FilterHeader } from '@/components/table/filter-header';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { formateDateDetail } from '@/lib/date-formatter';
import { BreadcrumbItem } from '@/types';
import { CustomerService } from '@/types/customer-service';
import { Customer } from '@/types/customers';
import { Head, Link, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Pencil } from 'lucide-react';

export const columns: ColumnDef<Customer>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return <FilterHeader label="Customer" column={column} />;
        },
        meta: {
            filterVariant: 'search',
        },
    },
    {
        accessorKey: 'status',
        header: ({ column }) => {
            return <FilterHeader label="Status" column={column} />;
        },
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            let badgeClass = '';

            switch (status) {
                case 'active':
                    badgeClass = 'bg-green-500';
                    break;
                case 'inactive':
                    badgeClass = 'bg-gray-500';
                    break;
                case 'suspended':
                    badgeClass = 'bg-amber-500';
                    break;
                case 'cancelled':
                    badgeClass = 'bg-red-500';
                    break;
            }

            return <Badge className={`${badgeClass}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
        },
        meta: {
            filterVariant: 'select',
        },
    },
    {
        accessorKey: 'registration_date',
        header: ({ column }) => {
            return <FilterHeader label="Registration Date" column={column} />;
        },
        cell: ({ row }) => {
            return formateDateDetail(row.getValue('registration_date'));
        },
        meta: {
            filterVariant: 'date',
        },
    },
    {
        accessorKey: 'project',
        header: ({ column }) => {
            return <FilterHeader label="Project" column={column} />;
        },
        meta: {
            filterVariant: 'search',
        },
    },
    {
        accessorKey: 'services_count',
        header: ({ column }) => {
            return <FilterHeader label="Services" column={column} />;
        },
        enableColumnFilter: false,
    },
    {
        accessorKey: 'id',
        header: 'Action',
        cell: (info) => {
            return (
                <div className="flex gap-2">
                    <Link href={`customers/${info.getValue()}/edit`} className="text-purewhite rounded px-2 py-1 hover:text-blue-400">
                        <Pencil />
                    </Link>
                    <Link href={`customers/${info.getValue()}`} className="text-purewhite rounded px-2 py-1 hover:text-amber-400">
                        <Eye />
                    </Link>
                </div>
            );
        },
        enableColumnFilter: false,
    },
];

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Customers',
        href: '/customers',
    },
];

const CustomersIndex = () => {
    const { customers } = usePage<{ customers: Array<Customer & { services: CustomerService[] }> }>().props;

    console.log(customers);

    const data = customers.map((customer) => {
        const registrationDate = formateDateDetail(customer.registration_date);

        return {
            id: customer.id,
            name: customer.name,
            status: customer.status,
            registration_date: customer.registration_date,
            formatted_date: registrationDate,
            project: customer.project?.id ? `#${customer.project.id}` : '-',
            services_count: customer.services?.length || 0,
            address: customer.address || '-',
        };
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Customers" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="space-y-4">
                    <div className="">
                        <div className="min-h-[60vh] max-w-screen overflow-x-scroll lg:overflow-hidden">
                            <DataTable columns={columns} data={data} searchColumn="name" />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default CustomersIndex;
