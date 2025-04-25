import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { formSchema } from '@/types/lead';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { z } from 'zod';
import { LeadForm } from './form_field';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Leads',
        href: '/leads',
    },
    {
        title: 'Create',
        href: '/leads/create',
    },
];

const LeadCreate = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        router.post(route('leads.store'), values, {
            onFinish: () => setIsSubmitting(false),
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Leads" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <LeadForm onSubmit={onSubmit} submitLabel={isSubmitting ? 'Submitting...' : 'Submit'} isLoading={isSubmitting} />
            </div>
        </AppLayout>
    );
};

export default LeadCreate;
