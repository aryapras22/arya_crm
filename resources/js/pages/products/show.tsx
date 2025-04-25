import { ReadOnlyField } from '@/components/form/read-only-field';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { formateDateDetail } from '@/lib/date-formatter';
import { BreadcrumbItem } from '@/types';
import { Product } from '@/types/product';
import { usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/products',
    },
    {
        title: 'Show',
        href: '/products/show',
    },
];

const ProductsShow = () => {
    const { product } = usePage<{ product: Product }>().props;

    const created_at = formateDateDetail(product.created_at);
    const updated_at = formateDateDetail(product.updated_at);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex flex-col gap-6">
                    <ReadOnlyField label="Name" value={product.name} placeholder="Name" />
                    <div>
                        <Label className="text-base">Description : </Label>
                        <Textarea className='text-base' value={product.description || ''} disabled />
                    </div>
                    <ReadOnlyField label="Speed" value={product.speed || '-'} placeholder="Speed" />
                    <ReadOnlyField label="Price" value={product.price.toString()} placeholder="Price" />
                    <ReadOnlyField label="Status" value={product.is_active ? 'Active' : 'Inactive'} placeholder="Status" />
                    <ReadOnlyField label="Updated At" value={updated_at} placeholder="Updated At" />
                    <ReadOnlyField label="Created At" value={created_at} placeholder="Created At" />
                </div>
            </div>
        </AppLayout>
    );
};

export default ProductsShow;
