import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import pb from '@/api/Pocketbase'
import { expenseSchema } from './data/schema'
import { toast } from '@/components/ui/use-toast'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";  // Ensure you have this import
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

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
    control,
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
        toast({
          title: "Tatizo",
          description:`Kuna tatizo la kiufundi`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Tatizo",
        description:`Kuna tatizo la kiufundi`,
        variant: "destructive",
      });
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
                <Controller
                  name="Date_Incurred"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={`w-full justify-start text-left font-normal ${!value ? "text-muted-foreground" : ""}`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {value ? format(new Date(value), "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={value ? new Date(value) : undefined}
                          onSelect={(date) => {
                            onChange(date ? format(date, "yyyy-MM-dd") : ""); // Store formatted date
                          }}
                          
                        />
                      </PopoverContent>
                    </Popover>
                  )}
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
