import { ReadOnlyField } from '@/components/form/read-only-field';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { formateDateDetail } from '@/lib/date-formatter';
import { BreadcrumbItem } from '@/types';
import { Project } from '@/types/project';
import { usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Projects',
        href: '/projects',
    },
    {
        title: 'Show',
        href: '/projects/show',
    },
];

const ProjectsShow = () => {
    const { project } = usePage<{ project: Project }>().props;

    const created_at = formateDateDetail(project.created_at);
    const updated_at = formateDateDetail(project.updated_at);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex flex-col gap-6">
                    <ReadOnlyField label="Lead" value={project.lead?.name || '-'} placeholder="Lead" />
                    <ReadOnlyField label="Sales Person" value={project.sales_person?.name || '-'} placeholder="Sales Person" />
                    <ReadOnlyField label="Status" value={project.status} placeholder="Status" />
                    <div>
                        <Label className="text-base">Notes: </Label>
                        <Textarea className="text-base" value={project.notes || ''} disabled />
                    </div>
                    <ReadOnlyField label="Approved By" value={project.approver?.name || '-'} placeholder="Approved By" />
                    <ReadOnlyField
                        label="Approved At"
                        value={project.approved_at ? formateDateDetail(project.approved_at) : '-'}
                        placeholder="Approved At"
                    />
                    <ReadOnlyField label="Updated At" value={updated_at} placeholder="Updated At" />
                    <ReadOnlyField label="Created At" value={created_at} placeholder="Created At" />
                </div>
            </div>
        </AppLayout>
    );
};

export default ProjectsShow;
