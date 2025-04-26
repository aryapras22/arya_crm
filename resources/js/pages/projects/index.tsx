import { DataTable } from '@/components/table/data-table';
import { FilterHeader } from '@/components/table/filter-header';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import AppLayout from '@/layouts/app-layout';
import { formateDateDetail } from '@/lib/date-formatter';
import { BreadcrumbItem } from '@/types';
import { Project } from '@/types/project';
import { Head, Link, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Pencil } from 'lucide-react';

export const columns: ColumnDef<Project>[] = [
    {
        accessorKey: 'lead',
        header: ({ column }) => {
            return <FilterHeader label="lead" column={column} />;
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
    },
    {
        accessorKey: 'sales_person',
        header: ({ column }) => {
            return <FilterHeader label="Sales Person" column={column} />;
        },
        meta: {
            filterVariant: 'select',
        },
    },
    {
        accessorKey: 'approved_by',
        header: ({ column }) => {
            return <FilterHeader label="Approved_by" column={column} />;
        },
        meta: {
            filterVariant: 'select',
        },
    },
    {
        accessorKey: 'updated_at',
        header: ({ column }) => {
            return <FilterHeader label="Last Updated" column={column} />;
        },
        cell: ({ row }) => {
            return formateDateDetail(row.getValue('updated_at'));
        },
        meta: {
            filterVariant: 'date',
        },
    },
    {
        accessorKey: 'id',
        header: 'Action',
        cell: (info) => {
            return (
                <div className="flex gap-2">
                    <Link href={`projects/${info.getValue()}/edit`} className="text-purewhite rounded px-2 py-1 hover:text-blue-400">
                        <Pencil />
                    </Link>
                    <Link href={`projects/${info.getValue()}`} className="text-purewhite rounded px-2 py-1 hover:text-amber-400">
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
        title: 'Projects',
        href: '/projects',
    },
];

const ProjectsIndex = () => {
    const { isManager, isSales } = useAuth();
    const { projects } = usePage<{ projects: Project[] }>().props;
    const data = projects.map((project) => {
        let approved_at = '-';
        if (project.approved_at) {
            approved_at = formateDateDetail(project.approved_at);
        }

        return {
            id: project.id,
            lead: project.lead.name,
            status: project.status,
            notes: project.notes,
            sales_person: project.sales_person?.name ?? '-',
            approved_by: project.approver?.name ?? '-',
            approved_at: approved_at,
            created_at: project.created_at,
            updated_at: project.updated_at,
        };
    });
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Projects" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="">
                    <Link href={route('projects.create')}>
                        <Button>Create New Projects</Button>
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

export default ProjectsIndex;
