import { z } from 'zod'

// We're keeping a simple non-relational schema here.
export const salesSchema = z.object({
  Car_Drive_Names: z.string(),      // Name of the car drive
  Date_Sent: z.string(),            // Date when the data was sent
  Quantity: z.number(),              // Quantity related to the sale
  id: z.string().optional(),         // Unique identifier for the record
  Did:z.number().optional()

});
export type sales = z.infer<typeof salesSchema>
