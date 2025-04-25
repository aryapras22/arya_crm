import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { formSchema, Lead } from '@/types/lead';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { z } from 'zod';
import { LeadForm } from './form_field';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Leads',
        href: '/leads',
    },
    {
        title: 'Edit',
        href: '/leads/edit',
    },
];

const LeadsEdit = () => {
    const { lead } = usePage<{ lead: Lead }>().props;
    const [isSubmitting, setIsSubmitting] = useState(false);

    function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        router.put(
            route('leads.update', lead.id),
            {
                ...values,
                id: lead.id,
            },
            {
                onFinish: () => setIsSubmitting(false),
            },
        );
    }

    function handleDelete() {
        if (confirm('Are you sure you want to delete this lead?')) {
            setIsSubmitting(true);

            router.delete(route('leads.destroy', lead.id), {
                onFinish: () => setIsSubmitting(false),
            });
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Leads" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="">
                    <LeadForm
                        lead={lead}
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

export default LeadsEdit;
