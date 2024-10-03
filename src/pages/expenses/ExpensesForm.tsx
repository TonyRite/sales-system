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
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import pb from '@/api/Pocketbase';
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";  // Ensure you have this import
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

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
    control,
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
      toast({
        title: "Tatizo",
        description:`Kuna tatizo la kiufundi`,
        variant: "destructive",
      });
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
              {/* <div className="col-span-3">
                <Input
                  id="date"
                  type='date'
                  {...register('date')}
                  placeholder="format year-month-date | 2024-10-01"
                  className="col-span-3"
                />
                {errors.date && <p className="text-red-600 mt-1 text-sm">{errors.date.message}</p>}
              </div> */}
              <div className="col-span-3">
                <Controller
                  name="date"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={`w-full justify-start text-left font-normal ${!value ? "text-muted-foreground" : ""}`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {value ? format(new Date(value), "PPP") : <span>Chagua Tarehe</span>}
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
