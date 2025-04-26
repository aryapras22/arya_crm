import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Lead } from '@/types/lead';
import { Project, PROJECT_STATUS, projectFormSchema } from '@/types/project';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type ProjectFormProps = {
    project?: Project;
    availableLeads: Lead[];
    onSubmit: (values: z.infer<typeof projectFormSchema>) => void;
    submitLabel: string;
    isLoading: boolean;
    isManager: boolean;
};

const ProjectForm = ({ project, onSubmit, submitLabel, isLoading, isManager, availableLeads }: ProjectFormProps) => {
    const form = useForm<z.infer<typeof projectFormSchema>>({
        resolver: zodResolver(projectFormSchema),
        defaultValues: {
            lead_id: project?.lead_id || 0,
            notes: project?.notes || '',
            status: project?.status || 'draft',
        },
    });

    function handleSubmit(values: z.infer<typeof projectFormSchema>) {
        onSubmit(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="lead_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Lead</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={(value) => field.onChange(parseInt(value))}
                                    value={field.value ? field.value.toString() : undefined}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a lead" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableLeads.map((lead) => (
                                            <SelectItem key={lead.id} value={lead.id.toString()}>
                                                {lead.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Notes of request.." {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {isManager && (
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PROJECT_STATUS.map((s) => (
                                                <SelectItem key={s} value={s}>
                                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                <div className="flex gap-4">
                    <Button type="submit" disabled={isLoading}>
                        {submitLabel}
                    </Button>
                   
                </div>
            </form>
        </Form>
    );
};

export default ProjectForm;
