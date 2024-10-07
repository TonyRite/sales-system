import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/custom/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import pb from '@/api/Pocketbase';
import { loanSchema } from './data/schema';
import { toast } from '@/components/ui/use-toast';
import { useState } from 'react';

// Define the type for the form data using the schema
type LoanFormSchema = z.infer<typeof loanSchema>;

interface EditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  stock: LoanFormSchema;  // Pass the selected loan record
}

export function DeleteLoan({ isOpen, onOpenChange, stock }: EditDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoanFormSchema>({
    resolver: zodResolver(loanSchema),
    defaultValues: {
      ...stock
    }
  });

   const [loading, setLoading] = useState(false);
  // Handle form submission
  const onSubmit = async (data: LoanFormSchema) => {
    try {
        setLoading(true);    
        // Check if stock.id exists
        if (data.id) {
          // Perform the delete operation
          await pb.collection('Loans').delete(data.id);
          // Reset form and close the modal (if applicable)
          reset();
          setLoading(false);
          onOpenChange(false);        
          // Optionally reload the page or perform any other action here
        } else {
          setLoading(false);
          console.error('Error: ID is undefined');
          // Show an error toast
          toast({
            title: "Tatizo",
            description: `Kuna tatizo`,
            variant: "destructive",
          });
        }
      } catch (error) {
        setLoading(false);
        console.error('Error deleting loan record:', error);
        
        // Show an error toast in case of failure
        toast({
          title: "Tatizo",
          description: `Kuna tatizo`,
          variant: "destructive",
        });
      }
      
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Loan</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="Name" className="text-right">
                Name
              </label>
              <div className="col-span-3">
                <Input
                  id="Name"
                  {...register('expand.CustomerId.Name')}
                  placeholder="Customer Name"
                  className="col-span-3"
                  readOnly
                />
                {errors.expand && <p className="text-red-600 mt-1 text-sm">{errors.expand.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="Amount" className="text-right">
                Amount
              </label>
              <div className="col-span-3">
                <Input
                  id="Amount"
                  {...register('Amount',{ valueAsNumber: true })}
                  placeholder="Loan Amount"
                  className="col-span-3"
                  readOnly
                />
                {errors.Amount && <p className="text-red-600 mt-1 text-sm">{errors.Amount.message}</p>}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button loading={loading} type="submit">Delete loan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
