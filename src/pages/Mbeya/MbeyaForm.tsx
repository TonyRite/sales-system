import { Button } from '@/components/custom/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import pb from '@/api/Pocketbase';
import { useState } from 'react';

// Define Zod schema for form validation
const SalesSchema = z.object({
  Car_Drive_Names: z.string().min(1, { message: "Name is required" }),
  Quantity: z
    .number({ invalid_type_error: "Quantity must be a number" })
    .positive({ message: "Quantity must be a positive number" }),  
  Date_Sent: z.string()
    .min(1, { message: "Date is required" }) // Ensure the date is not an empty string
    .refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val), {
      message: "Invalid date format, expected YYYY-MM-DD",  // Custom message for invalid format
    }),
});

type SalesFormSchema = z.infer<typeof SalesSchema>;

interface InputFormProps {
  onClose: () => void;  // New onClose prop to trigger data fetching
}

export function InputForm({ onClose }: InputFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SalesFormSchema>({
    resolver: zodResolver(SalesSchema),
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onSubmit = async (data: SalesFormSchema) => {
    try {
      const newTrip = {
        Car_Drive_Names: data.Car_Drive_Names,
        Date_Sent: data.Date_Sent,
        Quantity: data.Quantity,
      };

      await pb.collection('Sales').create(newTrip);

      reset();

      // Close the dialog and trigger data fetch
      setIsDialogOpen(false);
      onClose();  // Fetch the updated expenses after form submission
    } catch (error) {
      console.error('Error creating expense record:', error);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsDialogOpen(true)}>Add Oil Cargo</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add cargo details</DialogTitle>
          <DialogDescription>
            Add New cargo details
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Car/driver Name
              </Label>
              <div className="col-span-3"> 
                <Input
                  id="name"
                  {...register('Car_Drive_Names')}
                  placeholder="name"
                  className="col-span-3"
                />
                {errors.Car_Drive_Names && <p className="text-red-600 mt-1 text-sm">{errors.Car_Drive_Names.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 items-center">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <div className="col-span-3">
                <Input
                  id="quantity"
                  {...register('Quantity', { valueAsNumber: true })}
                  placeholder="Quantity"
                  className="w-full"
                />
                {errors.Quantity && <p className="text-red-600 mt-1 text-sm">{errors.Quantity.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <div className="col-span-3">
                <Input
                  id="date"
                  type='date'
                  {...register('Date_Sent')}
                  placeholder="format year-month-date | 2024-10-01"
                  className="col-span-3"
                />
                {errors.Date_Sent && <p className="text-red-600 mt-1 text-sm">{errors.Date_Sent.message}</p>}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
