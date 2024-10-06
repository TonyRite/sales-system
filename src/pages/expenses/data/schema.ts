import { z } from 'zod'

// We're keeping a simple non-relational schema here.

export const expenseSchema = z.object({
  Date: z.string(),           // Assuming the date is a string
  Name: z.string(),                    // The name is a string
  Price: z.number(),                   // The price is a number
  Quantity: z.number(),                // The quantity is a number
  Cid: z.number().optional(),
  id:z.string().optional(),                       // The ID is a string             
});

export type Expense = z.infer<typeof expenseSchema>

