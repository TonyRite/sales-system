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

export const loanSchema = z.object({
  Amount: z.number(),                               // The amount of the loan
  CustomerId: z.string(),                           // ID of the customer associated with the loan
  DateIssued: z.string(),                           // Date when the loan was issued
  DueDate: z.string(),                              // Due date for the loan repayment
  Status: z.string(),                               // Status of the loan (e.g., "Not Paid")
  collectionId: z.string(),                         // ID of the collection
  collectionName: z.string(),                       // Name of the collection (in this case, "Loans")
  created: z.string(),                              // Creation date of the loan record
  expand: z.object({                                // Expanded customer details
    CustomerId: z.object({
      Name: z.string(),                             // Name of the customer
      PhoneNumber: z.string(),                      // Phone number of the customer
      collectionId: z.string(),                     // ID of the customer's collection
      collectionName: z.string(),                   // Name of the customer's collection
      created: z.string(),                          // Creation date of the customer record
      id: z.string(),                               // Unique ID of the customer
      updated: z.string(),                           // Last updated date of the customer record
    })
  }),
  id: z.number(),                                   // Unique identifier for the loan record
  updated: z.string(),                              // Last updated date of the loan record
});

export type loan = z.infer<typeof loanSchema>
export type Task = z.infer<typeof taskSchema>
