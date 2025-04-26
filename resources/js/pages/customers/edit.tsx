import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Customer, customerFormSchema } from '@/types/customers';
import { Product } from '@/types/product';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { z } from 'zod';
import CustomerForm from './form_field';

interface PageProps {
    customer: Customer & {
        services: Array<{
            id: number;
            customer_id: number;
            product_id: number;
            start_date: string;
            end_date: string | null;
            product: Product;
        }>;
    };
    availableProducts: Product[];
    customerProductIds: number[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Customers',
        href: '/customers',
    },
    {
        title: 'Edit Customer',
        href: '/customers/edit',
    },
];

const CustomerEdit = () => {
    const { customer, availableProducts, customerProductIds } = usePage<PageProps>().props;
    const [isSubmitting, setIsSubmitting] = useState(false);

    function onSubmit(values: z.infer<typeof customerFormSchema>) {
        setIsSubmitting(true);
        router.put(route('customers.update', customer.id), values, {
            onFinish: () => setIsSubmitting(false),
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${customer.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-2xl font-bold">Edit Customer</h1>
                <div className="rounded-lg bg-white p-6 shadow">
                    <CustomerForm
                        customer={customer}
                        availableProducts={availableProducts}
                        customerProductIds={customerProductIds}
                        onSubmit={onSubmit}
                        submitLabel={isSubmitting ? 'Saving...' : 'Save Customer'}
                        isLoading={isSubmitting}
                    />
                </div>
            </div>
        </AppLayout>
    );
};

export default CustomerEdit;
