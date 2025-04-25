import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

import { Product, productFormSchema } from '@/types/product';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { z } from 'zod';
import { ProductForm } from './form_field';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Product',
        href: '/products',
    },
    {
        title: 'Edit',
        href: '/products/edit',
    },
];

const ProductEdit = () => {
    const { product } = usePage<{ product: Product }>().props;
    const [isSubmitting, setIsSubmitting] = useState(false);

    function onSubmit(values: z.infer<typeof productFormSchema>) {
        setIsSubmitting(true);
        router.put(
            route('products.update', product.id),
            {
                ...values,
                id: product.id,
            },
            {
                onFinish: () => setIsSubmitting(false),
            },
        );
    }

    function handleDelete() {
        if (confirm('Are you sure you want to delete this product?')) {
            setIsSubmitting(true);

            router.delete(route('products.destroy', product.id), {
                onFinish: () => setIsSubmitting(false),
            });
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="">
                    <ProductForm
                        product={product}
                        submitLabel={isSubmitting ? 'Saving...' : 'Save Changes'}
                        onSubmit={onSubmit}
                        onDelete={handleDelete}
                        isLoading={isSubmitting}
                    />
                </div>
            </div>
        </AppLayout>
    );
};

export default ProductEdit;
