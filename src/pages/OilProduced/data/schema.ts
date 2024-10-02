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
// export const taskSchema = z.object({
//   id: z.string(),
//   name:z.string(),
//   phone:z.string(),
//   money:z.string(),
//   Gunia:z.string(),
//   Date_entered:z.string(),
// })



export const customerSchema = z.object({
  CustomerId: z.string(),
  Date: z.string(),
  Gunia: z.number(),
  Mafuta: z.number(),
  collectionId: z.string(),
  collectionName: z.string(),
  created: z.string(),
  expand: z.object({
    CustomerId: z.object({
      Name: z.string(),
      PhoneNumber: z.string(),
      collectionId: z.string(),
      collectionName: z.string(),
      created: z.string(),
      id: z.string(),
      updated: z.string(),
    })
  }),
  id: z.string().optional(),
  Cid:z.number().optional(),
  updated: z.string(),
});


export type Customer = z.infer<typeof customerSchema>
// export type Task = z.infer<typeof taskSchema>
