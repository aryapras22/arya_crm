import { ReadOnlyField } from '@/components/form/read-only-field';
import AppLayout from '@/layouts/app-layout';
import { formateDateDetail } from '@/lib/date-formatter';
import { BreadcrumbItem } from '@/types';
import { Lead } from '@/types/lead';
import { usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Leads',
        href: '/leads',
    },
    {
        title: 'Show',
        href: '/leads/show',
    },
];

const LeadDetails = ({ lead }: { lead: Lead }) => {
    const created_at = formateDateDetail(lead.created_at);
    const updated_at = formateDateDetail(lead.updated_at);

    return (
        <div className="flex flex-col gap-6">
            <ReadOnlyField label="Name" value={lead.name} placeholder="Name" />
            <ReadOnlyField label="Email" value={lead.email} type="email" placeholder="Email" />
            <ReadOnlyField label="Phone" value={lead.phone} placeholder="Phone" />
            <ReadOnlyField label="Status" value={lead.status} placeholder="Status" />
            <ReadOnlyField label="Created By" value={lead.creator.name} placeholder="Created By" />
            <ReadOnlyField label="Updated At" value={updated_at} placeholder="Updated At" />
            <ReadOnlyField label="Created At" value={created_at} placeholder="Created At" />
        </div>
    );
};

const LeadsShow = () => {
    const { lead } = usePage<{ lead: Lead }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <LeadDetails lead={lead} />
            </div>
        </AppLayout>
    );
};

export default LeadsShow;
