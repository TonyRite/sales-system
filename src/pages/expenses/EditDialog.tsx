import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import pb from '@/api/Pocketbase'
import { expenseSchema } from './data/schema'

// Define the type for the form data using the schema
type ExpenseFormSchema = z.infer<typeof expenseSchema>

interface EditDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  expenses: ExpenseFormSchema  // Pass the selected expense record
}

export function EditDialog({ isOpen, onOpenChange, expenses }: EditDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ExpenseFormSchema>({
    resolver: zodResolver(expenseSchema),
    defaultValues: expenses,  // Populate form with the selected row data
  })

  // Handle form submission
  const onSubmit = async (data: ExpenseFormSchema) => {
    try {
      // Update the record in the database
      if (expenses.id) {
        await pb.collection('Expenses').update(expenses.id, data)
        // close box
        console.log(data)
        reset();
        onOpenChange(false)
        window.location.reload(); // Reload the page
      } else {
        console.error('Error: Cid is undefined')
      }
    } catch (error) {
      console.error('Error updating expense record:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <label htmlFor='Name' className='text-right'>
                Name
              </label>
              <div className='col-span-3'>
                <Input
                  id='name'
                  {...register('Name')}
                  placeholder='name'
                  className='col-span-3'
                />
                {errors.Name && <p className='text-red-600 mt-1 text-sm'>{errors.Name.message}</p>}
              </div>
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <label htmlFor='quantity' className='text-right'>
                Quantity
              </label>
              <div className='col-span-3'>
                <Input
                  id='quantity'
                  {...register('Quantity', { valueAsNumber: true })}
                  placeholder='Quantity'
                  className='w-full'
                />
                {errors.Quantity && <p className='text-red-600 mt-1 text-sm'>{errors.Quantity.message}</p>}
              </div>
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <label htmlFor='price' className='text-right'>
                Price
              </label>
              <div className='col-span-3'>
                <Input
                  id='price'
                  {...register('Price', { valueAsNumber: true })}
                  placeholder='Price'
                  className='col-span-3'
                />
                {errors.Price && <p className='text-red-600 mt-1 text-sm'>{errors.Price.message}</p>}
              </div>
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <label htmlFor='Date_Incurred' className='text-right'>
                Date
              </label>
              <div className='col-span-3'>
                <Input
                  id='Date_Incurred'
                  {...register('Date_Incurred')}
                  placeholder='YYYY-MM-DD'
                  className='col-span-3'
                  readOnly 
                />
                {errors.Date_Incurred && <p className='text-red-600 mt-1 text-sm'>{errors.Date_Incurred.message}</p>}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type='submit'>Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
