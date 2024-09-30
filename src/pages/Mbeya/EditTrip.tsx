import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/custom/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import pb from '@/api/Pocketbase';
import { salesSchema } from './data/schema';

// Define the type for the form data using the schema
type SalesFormSchema = z.infer<typeof salesSchema>;

interface EditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  sales: SalesFormSchema;  // Pass the selected expense record
}

export function EditTrip({ isOpen, onOpenChange, sales }: EditDialogProps) {

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SalesFormSchema>({
    resolver: zodResolver(salesSchema),
    defaultValues: {
      ...sales,
      Date_Sent: sales.Date_Sent ? sales.Date_Sent.split('T')[0] : '', // Ensure date is in YYYY-MM-DD format
    },
  });

  // Handle form submission
  const onSubmit = async (data: SalesFormSchema) => {
    try {
      // Update the record in the database
      if (sales.id) {
        await pb.collection('Sales').update(sales.id, data);
        reset();
        onOpenChange(false);
        window.location.reload(); // Reload the page
      } else {
        console.error('Error: Cid is undefined');
      }
    } catch (error) {
      console.error('Error updating expense record:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Edit Sale</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <label htmlFor='Name' className='text-right'>
                Car/driver Name
              </label>
              <div className='col-span-3'>
                <Input
                  id='Car_Drive_Names'
                  {...register('Car_Drive_Names')}
                  placeholder='Car_Drive_Names'
                  className='col-span-3'
                />
                {errors.Car_Drive_Names && <p className='text-red-600 mt-1 text-sm'>{errors.Car_Drive_Names.message}</p>}
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
              <label htmlFor='Date_Sent' className='text-right'>
                Date Sent
              </label>
              <div className='col-span-3'>
                <Input
                  id='Date_Sent'
                  {...register('Date_Sent')}
                  placeholder='YYYY-MM-DD'
                  className='col-span-3'
                  readOnly 
                />
                {errors.Date_Sent && <p className='text-red-600 mt-1 text-sm'>{errors.Date_Sent.message}</p>}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type='submit'>Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
