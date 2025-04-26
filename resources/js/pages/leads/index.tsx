import { DataTable } from '@/components/table/data-table';
import { FilterHeader } from '@/components/table/filter-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { formateDateDetail } from '@/lib/date-formatter';
import { BreadcrumbItem } from '@/types';
import { Lead } from '@/types/lead';
import { Head, Link, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Pencil } from 'lucide-react';

export const columns: ColumnDef<Lead>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return <FilterHeader label="Name" column={column} />;
        },
        meta: {
            filterVariant: 'search',
        },
    },
    {
        accessorKey: 'phone',
        header: ({ column }) => {
            return <FilterHeader label="Phone" column={column} />;
        },
        meta: {
            filterVariant: 'search',
        },
    },
    {
        accessorKey: 'email',
        header: ({ column }) => {
            return <FilterHeader label="Email" column={column} />;
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
        meta: {
            filterVariant: 'select',
        },
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            let badgeClass = '';

            switch (status) {
                case 'new':
                    badgeClass = 'bg-green-500';
                    break;
                case 'contacted':
                    badgeClass = 'bg-gray-500';
                    break;
                case 'qualified':
                    badgeClass = 'bg-amber-500';
                    break;
                case 'lost':
                    badgeClass = 'bg-red-500';
                    break;
                case 'converted':
                    badgeClass = 'bg-blue-500';
            }

            return <Badge className={`${badgeClass}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
        },
    },
    {
        accessorKey: 'created_by',
        header: ({ column }) => {
            return <FilterHeader label="Created By" column={column} />;
        },
        meta: {
            filterVariant: 'select',
        },
    },
    {
        accessorKey: 'id',
        header: 'Action',
        cell: (info) => {
            return (
                <div className="flex gap-2">
                    <Link href={`leads/${info.getValue()}/edit`} className="text-purewhite rounded px-2 py-1 hover:text-blue-400">
                        <Pencil />
                    </Link>
                    <Link href={`leads/${info.getValue()}`} className="text-purewhite rounded px-2 py-1 hover:text-amber-400">
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
        title: 'Leads',
        href: '/leads',
    },
];

const LeadsIndex = () => {
    const { leads } = usePage<{ leads: Lead[] }>().props;

    const data = leads.map((lead) => {
        const created_at = formateDateDetail(lead.created_at);
        const updated_at = formateDateDetail(lead.updated_at);
        return {
            id: lead.id,
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            status: lead.status,
            created_by: lead.creator.name,
            creator: lead.creator.id,
            created_at: created_at,
            updated_at: updated_at,
        };
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Leads" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="">
                    <Link href={route('leads.create')}>
                        <Button>Create New Lead</Button>
                    </Link>
                    <div className="">
                        <div className="min-h-[60vh] max-w-screen overflow-x-scroll lg:overflow-hidden">
                            <DataTable columns={columns} data={data} />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default LeadsIndex;
