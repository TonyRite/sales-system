import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/custom/button';
import { Input } from '@/components/ui/input';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import pb from '@/api/Pocketbase';
import { customerSchema } from './data/schema';
import { toast } from '@/components/ui/use-toast';
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';


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
    control,
    reset,
  } = useForm<CustomerFormSchema>({
    resolver: zodResolver(customerSchema),
    defaultValues:{
      ...stock
    }
  });
  const [loading, setLoading] = useState(false);
  // Handle form submission
  const onSubmit = async (data: CustomerFormSchema) => {
    try {
      setLoading(true);
      // Update the record in the database
      if (stock.id) {
        await pb.collection('Stocks').update(stock.id, data);
        reset();
        setLoading(false);
        onOpenChange(false);
        //close 
      } else {
        setLoading(false);
        console.error('Error: Cid is undefined');
        toast({
          title: "Tatizo",
          description:`Kuna tatizo`,
          variant: "destructive",
        });
      }
    } catch (error) {
      setLoading(false);
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

            <div className='grid grid-cols-4 items-center gap-4'>
              <label htmlFor='Date' className='text-right'>
                Date
              </label>
              <div className='col-span-3'>
                <Controller
                  name="Date"
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
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errors.Date && <p className='text-red-600 mt-1 text-sm'>{errors.Date.message}</p>}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button loading={loading} type='submit'>Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
