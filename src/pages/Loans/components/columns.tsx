import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import { loan } from '../data/schema'
import { ExpandData } from '@/pages/OilProduced/components/columns'

export const columns: ColumnDef<loan>[] = [
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
      const expandData :ExpandData = row.getValue('expand');
      const Name = expandData?.CustomerId?.Name || 'N/A'; // Safely access the PhoneNumber
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
      const expandData:ExpandData = row.getValue('expand');
      const PhoneNumber = expandData?.CustomerId?.PhoneNumber || 'N/A'; // Safely access the PhoneNumber
  
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {PhoneNumber}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'Amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Amount' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {`TSH ${new Intl.NumberFormat().format(row.getValue('Amount'))}`}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'DateIssued',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='DateIssued' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {(row.getValue('DateIssued') as string).split(' ')[0]}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'Status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {(row.getValue('Status'))}
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
