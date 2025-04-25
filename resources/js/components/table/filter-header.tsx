import { ArrowUpDown } from 'lucide-react';

export const FilterHeader = ({ label, column }: { label: string; column: any }) => {
    return (
        <button
            className="hover:bg-accent hover:text-accent-foreground flex items-center justify-start gap-1 rounded px-1 py-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
            {label}
            <ArrowUpDown className="h-4 w-4" />
        </button>
    );
};
