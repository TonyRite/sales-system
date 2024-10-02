"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/custom/button';
import { Input } from '@/components/ui/input'; // Keep this import if you still need other inputs
import { useForm, Controller } from 'react-hook-form'; // Use Controller for date picker
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import pb from '@/api/Pocketbase';
import { salesSchema } from './data/schema';
import { toast } from '@/components/ui/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";  // Ensure you have this import
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

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
    control,
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
        toast({
          title: "Tatizo",
          description: `Kuna tatizo la kiufundi`,
          variant: "destructive",
        });
        console.error('Error: Cid is undefined');
      }
    } catch (error) {
      toast({
        title: "Tatizo",
        description: `Kuna tatizo la kiufundi`,
        variant: "destructive",
      });
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
              <label htmlFor='Car_Drive_Names' className='text-right'>
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
                <Controller
                  name="Date_Sent"
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
