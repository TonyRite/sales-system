import { useState } from 'react'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import { Button } from '@/components/custom/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { expenseSchema } from '../data/schema'
import { EditDialog } from '../EditDialog'


interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  getCustomers: () => void; // Add getCustomers here
}

export function DataTableRowActions<TData>({
  row,
  getCustomers,
}: DataTableRowActionsProps<TData>) {
  const expenses = expenseSchema.parse(row.original)

  // State for managing the edit dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Handle opening the dialog
  const handleEditClick = () => {
    setIsEditDialogOpen(true);
  };

  // Close the dialog and reload the page
  const handleCloseDialog = () => {
    setIsEditDialogOpen(false);
    getCustomers();
  };


  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
          >
            <DotsHorizontalIcon className='h-4 w-4' />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[160px]'>
          {/* Edit Option - triggers the dialog */}
          <DropdownMenuItem onClick={handleEditClick}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      <EditDialog
        isOpen={isEditDialogOpen}
        onOpenChange={handleCloseDialog} // Use the handleCloseDialog to close and reload
        expenses={expenses}  // Pass the selected row's data to the dialog
      />
    </>
  )
}
