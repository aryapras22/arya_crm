import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Product, productFormSchema } from '@/types/product';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type ProductFormProps = {
    product?: Product;
    onSubmit: (values: z.infer<typeof productFormSchema>) => void;
    submitLabel: string;
    onDelete?: () => void;
    isLoading: boolean;
};
export const ProductForm = ({ product, onSubmit, submitLabel, onDelete, isLoading }: ProductFormProps) => {
    const form = useForm<z.infer<typeof productFormSchema>>({
        resolver: zodResolver(productFormSchema),
        defaultValues: {
            name: product?.name || '',
            description: product?.description || '',
            speed: product?.speed || '',
            price: product?.price || 0,
            is_active: false,
        },
    });

    function handleSubmit(values: z.infer<typeof productFormSchema>) {
        const processedValues = {
            ...values,
            price: Number(values.price),
        };
        onSubmit(processedValues);
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
                                <Input placeholder="Product name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Description of product" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="speed"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Speed</FormLabel>
                            <FormControl>
                                <Input placeholder="Product speed" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="Product price"
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        field.onChange(parseFloat(value) || 0);
                                    }}
                                    value={field.value}
                                    onBlur={field.onBlur}
                                    name={field.name}
                                    ref={field.ref}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Status</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={(value) => field.onChange(value === 'active')}
                                    defaultValue={product?.is_active ? 'active' : 'inactive'}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
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
                            Delete Product
                        </Button>
                    )}
                </div>
            </form>
        </Form>
    );
};
