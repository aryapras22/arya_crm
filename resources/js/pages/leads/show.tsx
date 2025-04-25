import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { formateDateDetail } from '@/lib/date-formatter';
import { BreadcrumbItem } from '@/types';
import { Lead } from '@/types/lead';
import { Input } from '@headlessui/react';
import { Head, usePage } from '@inertiajs/react';

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

const LeadsShow = () => {
    const { lead } = usePage<{ lead: Lead }>().props;
    const created_at = formateDateDetail(lead.created_at);
    const updated_at = formateDateDetail(lead.updated_at);
    const data = {
        id: lead.id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        status: lead.status,
        created_by: lead.creator.name,
        creator: lead.creator.id,
        created_at: created_at,
        updated_at: updated_at,
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lead" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-row items-center gap-6">
                        <Label>Name : </Label>
                        <Input disabled value={data.name} type="text" placeholder="Name" />
                    </div>

                    <div className="flex flex-row items-center gap-6">
                        <Label>Email : </Label>
                        <Input disabled value={data.email} type="email" placeholder="Email" />
                    </div>

                    <div className="flex flex-row items-center gap-6">
                        <Label>Phone : </Label>
                        <Input disabled value={data.phone} type="text" placeholder="Phone" />
                    </div>

                    <div className="flex flex-row items-center gap-6">
                        <Label>Status : </Label>
                        <Input disabled value={data.status} type="text" placeholder="Status" />
                    </div>

                    <div className="flex flex-row items-center gap-6">
                        <Label>Created By : </Label>
                        <Input disabled value={data.created_by} type="text" placeholder="Created By" />
                    </div>

                    <div className="flex flex-row items-center gap-6">
                        <Label>Created At : </Label>
                        <Input disabled value={data.created_at} type="text" placeholder="Created At" />
                    </div>

                    <div className="flex flex-row items-center gap-6">
                        <Label>Updated At : </Label>
                        <Input disabled value={data.updated_at} type="text" placeholder="Updated At" />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default LeadsShow;
