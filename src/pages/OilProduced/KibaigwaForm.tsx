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
const CustomerSchema = z.object({
  CustomerName: z.string().min(1, { message: "Name is required" }),
  PhoneNumber: z.string().min(1, { message: "Phone is required" }), // Change to string to allow better phone number handling
  Gunia: z
    .number({ invalid_type_error: "Ingiza idadi ya gunia, debe 7 sawa na gunia 1" }),
  Mafuta: z
    .number({ invalid_type_error: "Weka 0 kama bado hayajakamuliwa" }),
  Price: z
  .number({ invalid_type_error: "Ingiza Pesa sahihi" }),
  Date: z.string()
    .min(1, { message: "Date is required" })
    .refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val), {
      message: "Invalid date format, expected YYYY-MM-DD",
    }),
});

type CustomerFormSchema = z.infer<typeof CustomerSchema>;

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
  } = useForm<CustomerFormSchema>({
    resolver: zodResolver(CustomerSchema),
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onSubmit = async (data: CustomerFormSchema) => {
    const formatName = (name: string) =>
      name.toLowerCase().replace(/\b\w/g, (char: string) => char.toUpperCase());

    try {
      // 1. Find the customer by name
      const findingId = await pb.collection('Customers').getFullList({
        filter: `Name="${formatName(data.CustomerName)}"`,
      });
      
      if (findingId.length > 0) {
        // 2. If name is found, retrieve id 
        const customerId = findingId[0].id;
        const newTrip = {
          CustomerId: customerId,
          Gunia: data.Gunia,
          Mafuta: data.Mafuta,
          Price:data.Price,
          Date: data.Date,
        };
        
        // 3. Use the id found to update data in the stocks table
        await pb.collection('Stocks').create(newTrip);     
        reset();
        setIsDialogOpen(false);
        onClose();  // Fetch the updated expenses after form submission
      } else {
        // 4. If not found by name, proceed to create a new one
        const newCustomer = {
          Name: formatName(data.CustomerName),
          PhoneNumber: data.PhoneNumber,
        };
        const InCustomer = await pb.collection('Customers').create(newCustomer);
        
        // 5. After creating, grab id and use it to populate stock table
        const newPerson = {
          CustomerId: InCustomer.id,
          Gunia: data.Gunia,
          Mafuta: data.Mafuta,
          Price:data.Price,
          Date: data.Date,
        };
        await pb.collection('Stocks').create(newPerson);     
        reset();
        setIsDialogOpen(false);
        onClose();  
      }
    } catch (error) {
      toast({
        title: "Tatizo",
        description: 'Kuna tatizo la kiufundi',
        variant: "destructive",
      });
      console.error('Error creating expense record:', error);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsDialogOpen(true)}>Add Production Details</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ingiza Taarifa za Mzigo wa Mteja</DialogTitle>
          <DialogDescription>
            Taarifa za mteja
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="CustomerName" className="text-right">
                Jina la Mteja
              </Label>
              <div className="col-span-3"> 
                <Input
                  id="CustomerName"
                  {...register('CustomerName')}
                  placeholder="name"
                  className="col-span-3"
                />
                {errors.CustomerName && <p className="text-red-600 mt-1 text-sm">{errors.CustomerName.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 items-center">
              <Label htmlFor="PhoneNumber" className="text-right">
                Namba ya Simu
              </Label>
              <div className="col-span-3">
                <Input
                  id="PhoneNumber"
                  {...register('PhoneNumber')}
                  placeholder="PhoneNumber"
                  className="w-full"
                />
                {errors.PhoneNumber && <p className="text-red-600 mt-1 text-sm">{errors.PhoneNumber.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 items-center">
              <Label htmlFor="Gunia" className="text-right">
                Magunia (debe 7 ni gunia 1)
              </Label>
              <div className="col-span-3">
                <Input
                  id="Gunia"
                  {...register('Gunia', { valueAsNumber: true })}
                  placeholder="Quantity"
                  className="w-full"
                />
                {errors.Gunia && <p className="text-red-600 mt-1 text-sm">{errors.Gunia.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 items-center">
              <Label htmlFor="Mafuta" className="text-right">
                Mafuta (Dumu)
              </Label>
              <div className="col-span-3">
                <Input
                  id="Mafuta"
                  {...register('Mafuta', { valueAsNumber: true })}
                  placeholder="Quantity"
                  className="w-full"
                />
                {errors.Mafuta && <p className="text-red-600 mt-1 text-sm">{errors.Mafuta.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 items-center">
              <Label htmlFor="Price" className="text-right">
                Bei ya Gunia (Rose)
              </Label>
              <div className="col-span-3">
                <Input
                  id="Price"
                  {...register('Price', { valueAsNumber: true })}
                  placeholder="Price"
                  className="w-full"
                />
                {errors.Mafuta && <p className="text-red-600 mt-1 text-sm">{errors.Mafuta.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Date" className="text-right">
                Tarehe ya Mzigo Kuingia
              </Label>
              {/* <div className="col-span-3">
                <Input
                  id="Date"
                  type='date'
                  {...register('Date')}
                  className="col-span-3"
                />
                {errors.Date && <p className="text-red-600 mt-1 text-sm">{errors.Date.message}</p>}
              </div> */}
              <div className="col-span-3">
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
                {errors.Date && <p className="text-red-600 mt-1 text-sm">{errors.Date.message}</p>}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
