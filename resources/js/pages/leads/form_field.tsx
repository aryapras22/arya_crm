import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formSchema, Lead, LEAD_STATUS } from '@/types/lead';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type LeadFormProps = {
    lead?: Lead;
    onSubmit: (values: z.infer<typeof formSchema>) => void;
    submitLabel: string;
    onDelete?: () => void;
    isLoading: boolean;
};

export const LeadForm = ({ lead, onSubmit, submitLabel, onDelete, isLoading }: LeadFormProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: lead?.name || '',
            email: lead?.email || '',
            phone: lead?.phone || '',
            status: lead?.status || 'new',
        },
    });

    function handleSubmit(values: z.infer<typeof formSchema>) {
        onSubmit(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Lead name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                                <Input placeholder="+62000" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="lead@mail.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Status</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {LEAD_STATUS.map((s) => (
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

                <div className="flex gap-4">
                    <Button type="submit" disabled={isLoading}>
                        {submitLabel}
                    </Button>
                    {onDelete && (
                        <Button type="button" disabled={isLoading} variant="destructive" onClick={onDelete}>
                            Delete Lead
                        </Button>
                    )}
                </div>
            </form>
        </Form>
    );
};
