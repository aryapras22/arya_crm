import { Input } from '@headlessui/react';
import { Label } from '@radix-ui/react-dropdown-menu';

export const ReadOnlyField = ({
    label,
    value,
    type = 'text',
    placeholder,
}: {
    label: string;
    value: string;
    type?: string;
    placeholder?: string;
}) => (
    <div className="flex flex-row items-center gap-6">
        <Label>{label} : </Label>
        <Input disabled value={value} type={type} placeholder={placeholder} />
    </div>
);
