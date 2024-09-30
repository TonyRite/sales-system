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
const expenseSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  quantity: z
    .number({ invalid_type_error: "Quantity must be a number" })
    .positive({ message: "Quantity must be a positive number" }),
  money: z
    .number({ invalid_type_error: "Money must be a number" })
    .positive({ message: "Money must be a positive number" }),
  date: z.string()
    .min(1, { message: "Date is required" }) // Ensure the date is not an empty string
    .refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val), {
      message: "Invalid date format, expected YYYY-MM-DD",  // Custom message for invalid format
    }),  
});

type ExpenseFormSchema = z.infer<typeof expenseSchema>;

interface InputFormProps {
  onClose: () => void;  // New onClose prop to trigger data fetching
}

export function InputForm({ onClose }: InputFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ExpenseFormSchema>({
    resolver: zodResolver(expenseSchema),
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onSubmit = async (data: ExpenseFormSchema) => {
    try {
      const newExpense = {
        Name: data.name,
        Quantity: data.quantity,
        Price: data.money,
        Date_Incurred: data.date,
      };

      await pb.collection('Expenses').create(newExpense);

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
        <Button onClick={() => setIsDialogOpen(true)}>Add Expense</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
          <DialogDescription>
            Add New Expense
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <div className="col-span-3"> 
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="name"
                  className="col-span-3"
                />
                {errors.name && <p className="text-red-600 mt-1 text-sm">{errors.name.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 items-center">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <div className="col-span-3">
                <Input
                  id="quantity"
                  {...register('quantity', { valueAsNumber: true })}
                  placeholder="Quantity"
                  className="w-full"
                />
                {errors.quantity && <p className="text-red-600 mt-1 text-sm">{errors.quantity.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="money" className="text-right">
                Money
              </Label>
              <div className="col-span-3">
                <Input
                  id="money"
                  {...register('money', { valueAsNumber: true })}
                  placeholder="Money"
                  className="col-span-3"
                />
                {errors.money && <p className="text-red-600 mt-1 text-sm">{errors.money.message}</p>}
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
                  {...register('date')}
                  placeholder="format year-month-date | 2024-10-01"
                  className="col-span-3"
                />
                {errors.date && <p className="text-red-600 mt-1 text-sm">{errors.date.message}</p>}
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
