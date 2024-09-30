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
export const taskSchema = z.object({
  id: z.string(),
  name:z.string(),
  phone:z.string(),
  money:z.string(),
  Gunia:z.string(),
  Date_entered:z.string(),
})

export const salesSchema = z.object({
  Car_Drive_Names: z.string(),      // Name of the car drive
  Date_Sent: z.string(),            // Date when the data was sent
  Quantity: z.number(),              // Quantity related to the sale
  id: z.number(),                    // Unique identifier for the record

});

export type Task = z.infer<typeof taskSchema>
export type sales = z.infer<typeof salesSchema>
