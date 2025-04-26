import { useAuth } from '@/hooks/use-auth';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Lead } from '@/types/lead';
import { Project, projectFormSchema } from '@/types/project';
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
        title: 'Edit',
        href: '/projects/edit',
    },
];

const ProjectEdit = () => {
    const { project, availableLeads } = usePage<{ project: Project; availableLeads: Lead[] }>().props;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { isManager } = useAuth();

    function onSubmit(values: z.infer<typeof projectFormSchema>) {
        setIsSubmitting(true);
        if (values.status == 'approved') {
            router.post(
                route('projects.approve', project.id),
                {
                    ...values,
                    id: project.id,
                },
                {
                    onFinish: () => setIsSubmitting(false),
                },
            );
        } else if (values.status == 'rejected') {
            router.post(
                route('projects.reject', project.id),
                {
                    ...values,
                    id: project.id,
                },
                {
                    onFinish: () => setIsSubmitting(false),
                },
            );
        } else {
            router.put(
                route('projects.update', project.id),
                {
                    ...values,
                    id: project.id,
                },
                {
                    onFinish: () => setIsSubmitting(false),
                },
            );
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Projects" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="">
                    <ProjectForm
                        project={project}
                        availableLeads={availableLeads}
                        onSubmit={onSubmit}
                        submitLabel={isSubmitting ? 'Saving...' : 'Save Changes'}
                        isLoading={isSubmitting}
                        isManager={isManager}
                    />
                </div>
            </div>
        </AppLayout>
    );
};

export default ProjectEdit;
