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
import { useToast } from '@/components/ui/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";  // Ensure you have this import
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

// Define Zod schema for form validation
const CustomerSchema = z.object({
  CustomerName: z.string().min(1, { message: "Rose Ingiza jina kwa usahihi" }),
  PhoneNumber:z
  .number({ invalid_type_error: "Ingiza namba ya simu sahihi"})
  .min(1, { message: "Rose Phone is required" }),
  Pesa: z
    .number({ invalid_type_error: "Rose ingiza idadi ya magunia kwa tarakimu" })
    .positive({ message: "Rose Ingiza kiasi kwa usahihi," }),
  Date: z.string()
    .min(1, { message: "Ingiza tarehe bwana" }) // Ensure the date is not an empty string
    .refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val), {
      message: "Invalid date format, expected YYYY-MM-DD",  // Custom message for invalid format
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

  const { toast } = useToast(); // Use the toast hook
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onSubmit = async (data: CustomerFormSchema) => {
  
    const formatName = (name: string) =>
      name.toLowerCase().replace(/\b\w/g, (char: string) => char.toUpperCase());
  
    try {
      // 1. Find the customer by name
      let findingId = await pb.collection('Customers').getFullList({
        filter: `Name="${formatName(data.CustomerName)}"`,
      });
  
      if (findingId.length > 0) {
        // 2. If name is found, retrieve ID and create new loan
        let customerId = findingId[0].id;
        const newLoan = {
          CustomerId: customerId,
          Amount: data.Pesa,
          Status:'Not Paid',
          DateIssued: data.Date,
        };
        await pb.collection('Loans').create(newLoan);
        reset();
        setIsDialogOpen(false);
        onClose();  // Fetch the updated expenses after form submission
      } else {
        // 4. If not found, show a toast message
        toast({
          title: "Tatizo",
          description:`${data.CustomerName} hana Mzigo hawez pata mkopo`,
          variant: "destructive",
        });
        reset();
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error('Error creating expense record:', error);
      toast({
        title: "Tatizo",
        description:'Kuna Tatizo ,mpigie Tony au angalia mtandao wako',
        variant: "destructive",
      });
    }
  };
  

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsDialogOpen(true)}>Toa Mkopo</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ingiza Taarifa za mkopo wa Mteja</DialogTitle>
          <DialogDescription>
           Taarifa za Mteja
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
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
              <Label htmlFor="quantity" className="text-right">
                Namba ya Simu
              </Label>
              <div className="col-span-3">
                <Input
                  id="quantity"
                  {...register('PhoneNumber', { valueAsNumber: true })}
                  placeholder="PhoneNumber"
                  className="w-full"
                />
                {errors.PhoneNumber && <p className="text-red-600 mt-1 text-sm">{errors.PhoneNumber.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 items-center">
              <Label htmlFor="quantity" className="text-right">
                Pesa
              </Label>
              <div className="col-span-3">
                <Input
                  id="quantity"
                  {...register('Pesa', { valueAsNumber: true })}
                  placeholder="Quantity"
                  className="w-full"
                />
                {errors.Pesa && <p className="text-red-600 mt-1 text-sm">{errors.Pesa.message}</p>}
              </div>
            </div>

            {/* <div className="grid grid-cols-4 gap-4 items-center">
              <Label htmlFor="quantity" className="text-right">
                Mafuta (Dumu)
              </Label>
              <div className="col-span-3">
                <Input
                  id="quantity"
                  {...register('Mafuta', { valueAsNumber: true })}
                  placeholder="Quantity"
                  className="w-full"
                />
                {errors.Mafuta && <p className="text-red-600 mt-1 text-sm">{errors.Mafuta.message}</p>}
              </div>
            </div> */}

            {/* <div className="grid grid-cols-4 gap-4 items-center">
              <Label htmlFor="quantity" className="text-right">
                Gharama ya Kukamulisha
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
            </div> */}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Tarehe ya Kutoa Mkopo
              </Label>
              {/* <div className="col-span-3">
                <Input
                  id="date"
                  type='date'
                  {...register('Date')}
                  placeholder="format year-month-date | 2024-10-01"
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
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
