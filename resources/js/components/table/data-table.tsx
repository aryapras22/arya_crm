'use client';

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React, { useState } from 'react';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            sorting,
            columnFilters,
        },
    });

    return (
        <div className="mt-5">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            <div className="">
                                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                                {header.column.getCanFilter() ? (
                                                    <div className="h-10">
                                                        <Filter column={header.column} />
                                                    </div>
                                                ) : (
                                                    <div className="h-10"></div>
                                                )}
                                            </div>
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <div className="h-2" />
                <div className="flex items-center justify-center gap-2">
                    <button className="rounded border p-1" onClick={() => table.firstPage()} disabled={!table.getCanPreviousPage()}>
                        {'<<'}
                    </button>
                    <button className="rounded border p-1" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        {'<'}
                    </button>
                    <button className="rounded border p-1" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        {'>'}
                    </button>
                    <button className="rounded border p-1" onClick={() => table.lastPage()} disabled={!table.getCanNextPage()}>
                        {'>>'}
                    </button>
                    <span className="flex items-center gap-1">
                        <div>Page</div>
                        <strong>
                            {table.getState().pagination.pageIndex + 1} of {table.getPageCount().toLocaleString()}
                        </strong>
                    </span>
                    <span className="flex items-center gap-1">
                        | Go to page:
                        <input
                            type="number"
                            min="1"
                            max={table.getPageCount()}
                            defaultValue={table.getState().pagination.pageIndex + 1}
                            onChange={(e) => {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                                table.setPageIndex(page);
                            }}
                            className="w-16 rounded border p-1"
                        />
                    </span>
                    <select
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => {
                            table.setPageSize(Number(e.target.value));
                        }}
                    >
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="ml-4">
                    Showing {table.getRowModel().rows.length.toLocaleString()} of {table.getRowCount().toLocaleString()} Rows
                </div>
            </div>
        </div>
    );
}

function Filter({ column }) {
    const columnFilterValue = column.getFilterValue();
    const { filterVariant } = column.columnDef.meta ?? {};

    const data = Array.from(column.getFacetedUniqueValues().keys()).sort().slice(0, 500);

    return filterVariant === 'select' ? (
        <select
            className="h-8 w-30 rounded-sm border p-1"
            onChange={(e) => column.setFilterValue(e.target.value)}
            value={columnFilterValue?.toString()}
        >
            <option value="">All</option>
            {data.map((d) => (
                <option value={d.toString()} key={d.toString()}>
                    {d.toString()}
                </option>
            ))}
        </select>
    ) : (
        <DebouncedInput
            className="h-8 w-30 rounded-sm border p-1"
            onChange={(value) => column.setFilterValue(value)}
            placeholder={`Search...`}
            type="text"
            value={(columnFilterValue ?? '') as string}
        />
    );
}

function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}: {
    value: string | number;
    onChange: (value: string | number) => void;
    debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    const [value, setValue] = React.useState(initialValue);

    React.useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value);
        }, debounce);

        return () => clearTimeout(timeout);
    }, [value]);

    return <input {...props} value={value} onChange={(e) => setValue(e.target.value)} />;
}
