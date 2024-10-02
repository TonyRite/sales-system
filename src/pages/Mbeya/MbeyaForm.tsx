"use client";

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
import { Input } from "@/components/ui/input";  // Keep this import if you still need other inputs
import { Label } from "@/components/ui/label";
import { useForm, Controller } from 'react-hook-form';
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
const SalesSchema = z.object({
  Car_Drive_Names: z.string().min(1, { message: "Name is required" }),
  Quantity: z
    .number({ invalid_type_error: "Quantity must be a number" })
    .positive({ message: "Quantity must be a positive number" }),
  Date_Sent: z.string()
    .min(1, { message: "Date is required" })
    .refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val), {
      message: "Invalid date format, expected YYYY-MM-DD",
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
    control,
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
      setIsDialogOpen(false);
      onClose();
    } catch (error) {
      toast({
        title: "Tatizo",
        description: `Kuna tatizo la kiufundi`,
        variant: "destructive",
      });
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
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
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
