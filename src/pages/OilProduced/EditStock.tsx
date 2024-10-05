import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/custom/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import pb from '@/api/Pocketbase';
import { customerSchema } from './data/schema';
import { toast } from '@/components/ui/use-toast';


// Define the type for the form data using the schema
type CustomerFormSchema = z.infer<typeof customerSchema>;

interface EditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  stock: CustomerFormSchema;  // Pass the selected expense record
}

export function EditStock({ isOpen, onOpenChange, stock }: EditDialogProps) {

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CustomerFormSchema>({
    resolver: zodResolver(customerSchema),
    defaultValues:{
      ...stock
    }
  });

  // Handle form submission
  const onSubmit = async (data: CustomerFormSchema) => {
    try {
      // Update the record in the database
      if (stock.id) {
        await pb.collection('Stocks').update(stock.id, data);
        reset();
        onOpenChange(false);
        //close 
      } else {
        console.error('Error: Cid is undefined');
        toast({
          title: "Tatizo",
          description:`Kuna tatizo`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating expense record:', error);
      toast({
        title: "Tatizo",
        description:`Kuna tatizo`,
        variant: "destructive",
      });
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
                Name
              </label>
              <div className='col-span-3'>
                <Input
                  id='Name'
                  {...register('expand.CustomerId.Name')}
                  placeholder='Name'
                  className='col-span-3'
                  readOnly
                />
                {errors.expand && <p className='text-red-600 mt-1 text-sm'>{errors.expand.message}</p>}
              </div>
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <label htmlFor='Name' className='text-right'>
                Gunia
              </label>
              <div className='col-span-3'>
                <Input
                  id='Gunia'
                  {...register('Gunia',{valueAsNumber:true})}
                  placeholder='Gunia'
                  className='col-span-3'
                  readOnly
                />
                {errors.Gunia && <p className='text-red-600 mt-1 text-sm'>{errors.Gunia.message}</p>}
              </div>
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <label htmlFor='quantity' className='text-right'>
                Mafuta
              </label>
              <div className='col-span-3'>
                <Input
                  id='quantity'
                  {...register('Mafuta', { valueAsNumber: true })}
                  placeholder='Quantity'
                  className='w-full'
                />
                {errors.Mafuta && <p className='text-red-600 mt-1 text-sm'>{errors.Mafuta.message}</p>}
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
