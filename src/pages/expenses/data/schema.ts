import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
// export const taskSchema = z.object({
//   id: z.string(),
//   title: z.string(),
//   status: z.string(),
//   label: z.string(),
//   priority: z.string(),
// })


export const expenseSchema = z.object({
  Date_Incurred: z.string(),           // Assuming the date is a string
  Name: z.string(),                    // The name is a string
  Price: z.number(),                   // The price is a number
  Quantity: z.number(),                // The quantity is a number
  id: z.number(),                      // The ID is a string              // The updated date is a string
});

export type Expense = z.infer<typeof expenseSchema>

