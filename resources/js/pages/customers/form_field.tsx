import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { CustomerService } from '@/types/customer-service';
import { Customer, CUSTOMER_STATUS, customerFormSchema } from '@/types/customers';
import { Product } from '@/types/product';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

const customerWithServicesSchema = customerFormSchema.extend({
    services: z
        .array(
            z.object({
                id: z.number().optional(),
                product_id: z.number({
                    required_error: 'Please select a product',
                }),
                start_date: z.string({
                    required_error: 'Start date is required',
                }),
                end_date: z.string().nullable(),
            }),
        )
        .default([]),
});

type CustomerWithServices = z.infer<typeof customerWithServicesSchema>;

type CustomerFormProps = {
    customer: Customer & { services?: CustomerService[] };
    availableProducts: Product[];
    onSubmit: (values: CustomerWithServices) => void;
    submitLabel: string;
    isLoading: boolean;
};

const CustomerForm = ({ customer, availableProducts, onSubmit, submitLabel, isLoading }: CustomerFormProps) => {
    const form = useForm<CustomerWithServices>({
        resolver: zodResolver(customerWithServicesSchema),
        defaultValues: {
            name: customer?.name || '',
            address: customer?.address || '',
            registration_date: customer?.registration_date || new Date().toISOString().split('T')[0],
            status: customer?.status || 'active',
            services:
                customer?.services?.map((service) => ({
                    id: service.id,
                    product_id: service.product_id,
                    start_date: service.start_date,
                    end_date: service.end_date,
                })) || [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'services',
    });

    function handleSubmit(values: CustomerWithServices) {
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
                            <FormLabel>Customer Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Customer name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Customer address" {...field} value={field.value || ''} />
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
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CUSTOMER_STATUS.map((status) => (
                                            <SelectItem key={status} value={status}>
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Customer Services</h3>
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => append({ product_id: 0, start_date: new Date().toISOString().split('T')[0], end_date: null })}
                        >
                            <PlusIcon className="mr-2 h-4 w-4" /> Add Service
                        </Button>
                    </div>

                    {fields.map((field, index) => (
                        <div key={field.id} className="space-y-4 rounded-md border p-4">
                            <div className="flex items-start justify-between">
                                <h4 className="font-medium">Service #{index + 1}</h4>
                                <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
                                    <TrashIcon className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>

                            <FormField
                                control={form.control}
                                name={`services.${index}.product_id`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product</FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={(value) => field.onChange(parseInt(value))}
                                                value={field.value ? field.value.toString() : undefined}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a product" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {availableProducts.map((product) => (
                                                        <SelectItem key={product.id} value={product.id.toString()}>
                                                            {product.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name={`services.${index}.start_date`}
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Start Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={'outline'}
                                                            className={cn(
                                                                'w-full pl-3 text-left font-normal',
                                                                !field.value && 'text-muted-foreground',
                                                            )}
                                                        >
                                                            {field.value ? format(new Date(field.value), 'PPP') : <span>Pick a date</span>}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value ? new Date(field.value) : undefined}
                                                        onSelect={(date) => field.onChange(date?.toISOString().split('T')[0] || '')}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={`services.${index}.end_date`}
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>End Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={'outline'}
                                                            className={cn(
                                                                'w-full pl-3 text-left font-normal',
                                                                !field.value && 'text-muted-foreground',
                                                            )}
                                                        >
                                                            {field.value ? format(new Date(field.value), 'PPP') : <span>Pick a date (optional)</span>}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value ? new Date(field.value) : undefined}
                                                        onSelect={(date) => field.onChange(date?.toISOString().split('T')[0] || null)}
                                                        initialFocus
                                                        disabled={(date) => {
                                                            const startDate = form.getValues(`services.${index}.start_date`);
                                                            return startDate ? date < new Date(startDate) : false;
                                                        }}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    ))}

                    {fields.length === 0 && (
                        <div className="rounded-md border border-dashed p-4 text-center">
                            <p className="text-muted-foreground">No services added yet</p>
                            <Button
                                type="button"
                                variant="outline"
                                className="mt-2"
                                onClick={() => append({ product_id: 0, start_date: new Date().toISOString().split('T')[0], end_date: null })}
                            >
                                <PlusIcon className="mr-2 h-4 w-4" /> Add Service
                            </Button>
                        </div>
                    )}
                </div>

                <Button type="submit" disabled={isLoading}>
                    {submitLabel}
                </Button>
            </form>
        </Form>
    );
};

export default CustomerForm;
