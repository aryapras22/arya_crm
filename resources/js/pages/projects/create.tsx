import { useAuth } from '@/hooks/use-auth';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Lead } from '@/types/lead';
import { projectFormSchema } from '@/types/project';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { z } from 'zod';
import ProjectForm from './form_field';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Projects',
        href: '/projects',
    },
    {
        title: 'Create',
        href: '/projects/create',
    },
];

const ProjectCreate = () => {
    const { availableLeads } = usePage<{ availableLeads: Lead[] }>().props;
    const { isManager } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    function onSubmit(values: z.infer<typeof projectFormSchema>) {
        setIsSubmitting(true);
        router.post(route('projects.store'), values, {
            onFinish: () => setIsSubmitting(false),
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Projects" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="">
                    <ProjectForm
                        availableLeads={availableLeads}
                        onSubmit={onSubmit}
                        submitLabel={isSubmitting ? 'Submitting' : 'Submit'}
                        isLoading={isSubmitting}
                        isManager={isManager}
                    />
                </div>
            </div>
        </AppLayout>
    );
};

export default ProjectCreate;
