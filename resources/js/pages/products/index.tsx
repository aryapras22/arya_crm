import { DataTable } from '@/components/table/data-table';
import { FilterHeader } from '@/components/table/filter-header';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { formateDateDetail } from '@/lib/date-formatter';
import { BreadcrumbItem } from '@/types';
import { Product } from '@/types/product';
import { Head, Link, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Pencil } from 'lucide-react';

export const columns: ColumnDef<Product>[] = [
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
        accessorKey: 'description',
        header: ({ column }) => {
            return <FilterHeader label="description" column={column} />;
        },
    },
    {
        accessorKey: 'speed',
        header: ({ column }) => {
            return <FilterHeader label="Speed" column={column} />;
        },
        meta: {
            filterVariant: 'select',
        },
    },
    {
        accessorKey: 'is_active',
        header: ({ column }) => {
            return <FilterHeader label="Is Active" column={column} />;
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
                    <Link href={`products/${info.getValue()}/edit`} className="text-purewhite rounded px-2 py-1 hover:text-blue-400">
                        <Pencil />
                    </Link>
                    <Link href={`products/${info.getValue()}`} className="text-purewhite rounded px-2 py-1 hover:text-amber-400">
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
        title: 'Products',
        href: '/products',
    },
];

const ProductsIndex = () => {
    const { products } = usePage<{ products: Product[] }>().props;

    const data = products.map((product) => {
        const created_at = formateDateDetail(product.created_at);
        const updated_at = formateDateDetail(product.updated_at);
        return {
            id: product.id,
            name: product.name,
            description: product.description,
            speed: product.speed,
            price: product.price,
            is_active: product.is_active ? '✅' : '❌',
            created_at: created_at,
            updated_at: updated_at,
        };
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="">
                    <Link href={route('products.create')}>
                        <Button>Create New Product</Button>
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

export default ProductsIndex;
