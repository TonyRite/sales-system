import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import { Customer } from '../data/schema'

export type ExpandData = {
  CustomerId?: {
    Name?: string;
    PhoneNumber:String
  };
};
export const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: 'Cid',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ row }) => <div className='w-[80px]'>{row.getValue('Cid')}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'customerName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => {
      // Get the expand data for the current row
      const expandData: ExpandData = row.getValue('expand');
      const Name = expandData?.CustomerId?.Name || 'N/A'; // Safely access the Name
  
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {Name}
          </span>
        </div>
      );
    },
    filterFn: (row, filterValue) => {
      // Access the expanded data (nested)
      const expandData = row.original.expand;  // Access `row.original` for raw data
      const Name = expandData?.CustomerId?.Name || '';
      
      // Perform case-insensitive filtering
      return Name.toLowerCase().includes(filterValue.toLowerCase());
    }
  },  
  {
    accessorKey: 'expand',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Phone' />
    ),
    cell: ({ row }) => {
      // Get the expand data for the current row
      const expandData: ExpandData = row.getValue('expand');
      const phoneNumber = expandData?.CustomerId?.PhoneNumber || 'N/A'; // Safely access the PhoneNumber
  
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {phoneNumber}
          </span>
        </div>
      );
    },
  },  
  {
    accessorKey: 'Gunia',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Gunia' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {`Gunia ${row.getValue('Gunia')}`}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'Mafuta',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Mafuta' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {`Dumu ${row.getValue('Mafuta')}`}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'Pesa',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Pesa ya kukamua' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {`Tsh ${new Intl.NumberFormat().format((row.getValue('Mafuta') as number) * 7000)}`}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'Date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Date_entered' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {(row.getValue('Date') as string).toString().split(' ')[0]}
          </span>
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
