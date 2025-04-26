import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import AppLayout from '@/layouts/app-layout';
import { formateDateDetail } from '@/lib/date-formatter';
import { BreadcrumbItem } from '@/types';
import { Lead } from '@/types/lead';
import { Project } from '@/types/project';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRightIcon, CalendarIcon, CheckCircleIcon, UsersIcon } from 'lucide-react';
import React from 'react';

interface MetricValue {
    current: number;
    previous?: number;
    growth?: number;
}

interface ManagerMetrics {
    totalLeads: MetricValue;
    totalProjects: MetricValue;
    approvedProjects: MetricValue;
    conversionRate?: MetricValue;
}

interface SalesMetrics {
    myLeads: MetricValue;
    myProjects: MetricValue;
    approvedProjects: MetricValue;
    pendingProjects: MetricValue;
}

type Metrics = ManagerMetrics | SalesMetrics;

interface PageProps {
    metrics: Metrics;
    recentLeads: Lead[];
    recentProjects: Project[];
    [key: string]: unknown;
}

interface MetricCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

// Metric Card Component
const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon }) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    );
};

export default function Dashboard() {
    const { isManager } = useAuth();
    const { metrics, recentLeads, recentProjects } = usePage<PageProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>

                {/* Key Metrics */}
                <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
                    {isManager ? (
                        <>
                            <MetricCard
                                title="Total Leads"
                                value={(metrics as ManagerMetrics)?.totalLeads?.current || 0}
                                icon={<UsersIcon className="text-muted-foreground h-4 w-4" />}
                            />
                            <MetricCard
                                title="Total Projects"
                                value={(metrics as ManagerMetrics)?.totalProjects?.current || 0}
                                icon={<CalendarIcon className="text-muted-foreground h-4 w-4" />}
                            />
                            <MetricCard
                                title="Approved Projects"
                                value={(metrics as ManagerMetrics)?.approvedProjects?.current || 0}
                                icon={<CheckCircleIcon className="text-muted-foreground h-4 w-4" />}
                            />
                        </>
                    ) : (
                        <>
                            <MetricCard
                                title="My Leads"
                                value={(metrics as SalesMetrics)?.myLeads?.current || 0}
                                icon={<UsersIcon className="text-muted-foreground h-4 w-4" />}
                            />
                            <MetricCard
                                title="My Projects"
                                value={(metrics as SalesMetrics)?.myProjects?.current || 0}
                                icon={<CalendarIcon className="text-muted-foreground h-4 w-4" />}
                            />
                            <MetricCard
                                title="Approved Projects"
                                value={(metrics as SalesMetrics)?.approvedProjects?.current || 0}
                                icon={<CheckCircleIcon className="text-muted-foreground h-4 w-4" />}
                            />
                            <MetricCard
                                title="Pending Projects"
                                value={(metrics as SalesMetrics)?.pendingProjects?.current || 0}
                                icon={<CalendarIcon className="text-muted-foreground h-4 w-4" />}
                            />
                        </>
                    )}
                </div>

                {/* Recent Activity Section */}
                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                    {/* Recent Leads */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Recent Leads</CardTitle>
                            <Link href={route('leads.index')} className="flex items-center text-sm text-blue-600 hover:underline">
                                View All <ArrowRightIcon className="ml-1 h-4 w-4" />
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentLeads && recentLeads.length > 0 ? (
                                    recentLeads.slice(0, 5).map((lead) => (
                                        <div key={lead.id} className="flex items-center justify-between border-b pb-2">
                                            <div>
                                                <Link href={route('leads.show', lead.id)} className="font-medium hover:underline">
                                                    {lead.name}
                                                </Link>
                                                <p className="text-muted-foreground text-sm">{lead.email}</p>
                                            </div>
                                            <span className="text-muted-foreground text-xs">{formateDateDetail(lead.created_at)}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted-foreground text-sm">No recent leads found.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Projects */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Recent Projects</CardTitle>
                            <Link href={route('projects.index')} className="flex items-center text-sm text-blue-600 hover:underline">
                                View All <ArrowRightIcon className="ml-1 h-4 w-4" />
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentProjects && recentProjects.length > 0 ? (
                                    recentProjects.slice(0, 5).map((project) => (
                                        <div key={project.id} className="flex items-center justify-between border-b pb-2">
                                            <div>
                                                <Link href={route('projects.show', project.id)} className="font-medium hover:underline">
                                                    Project #{project.id}
                                                </Link>
                                                <p className="text-muted-foreground text-sm">{project.lead?.name || 'Unknown lead'}</p>
                                            </div>
                                            <div className="text-right">
                                                <span
                                                    className={`inline-block rounded-full px-2 py-1 text-xs ${
                                                        project.status === 'approved'
                                                            ? 'bg-green-100 text-green-800'
                                                            : project.status === 'rejected'
                                                              ? 'bg-red-100 text-red-800'
                                                              : 'bg-yellow-100 text-yellow-800'
                                                    }`}
                                                >
                                                    {project.status.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted-foreground text-sm">No recent projects found.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
