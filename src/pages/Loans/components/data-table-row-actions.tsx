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
import { loanSchema } from '../data/schema'
import { EditLoan } from '../EditLoan'
import { DeleteLoan } from '../deleteLoan'


interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  getCustomers: () => void;
}

export function DataTableRowActions<TData>({
  row,
  getCustomers
}: DataTableRowActionsProps<TData>) {
  const LoanStock = loanSchema.parse(row.original)

  // State for managing the edit dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // State for managing the delete dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Handle opening the dialog
  const handleEditClick = () => {
    setIsEditDialogOpen(true);
  };

  // Handle opening the dialog
  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  }

  // close and reload 
  const handleCloseDelete = () => {
    setIsDeleteDialogOpen(false);
    getCustomers();
  }

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
          <DropdownMenuItem onClick={handleDeleteClick}>
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      <EditLoan
        isOpen={isEditDialogOpen}
        onOpenChange={handleCloseDialog} // Use the handleCloseDialog to close and reload
        stock={LoanStock}  // Pass the selected row's data to the dialog
      />

      {/* delete */}
      <DeleteLoan
        isOpen={isDeleteDialogOpen}
        onOpenChange={handleCloseDelete} // Use the handleCloseDialog to close and reload
        stock={LoanStock}  // Pass the selected row's data to the dialog
      />
    </>
  )
}
