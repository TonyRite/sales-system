import { Layout } from '@/components/custom/layout'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { DataTable } from './components/data-table'
import { columns } from './components/columns'
import pb from '@/api/Pocketbase'
import { useEffect, useState } from 'react'

export interface CustomerDetails {
  Name: string;          // Name of the customer
  PhoneNumber: string;   // Phone number of the customer
  collectionId: string;  // ID of the customer's collection
  collectionName: string; // Name of the customer's collection
  created: string;       // Creation date of the customer record
  id: string;            // Unique ID of the customer
  updated: string;       // Last updated date of the customer record
}
export interface CustomerRecordModel {
  CustomerId: string;
  Date: string;
  Gunia: number;
  Mafuta: number;
  collectionId: string;
  collectionName: string;
  created: string;
  expand: {
    CustomerId: CustomerDetails
  };
  id: number;
  updated: string;
}


export default function Tasks() {
// remove task ,refactor reuse 
  const [customers, setCustomers] = useState<CustomerRecordModel[]>([]);

  const getCustomers = async () => {
    pb.autoCancellation(false);
    const customersData = await pb.collection('Stocks').getList(1, 50, {expand:'CustomerId'});
    setCustomers(customersData.items.map((item,index) => ({
      id: (index + 1),
      // id:1,
      CustomerId: item.CustomerId,
      Date: item.Date,
      Gunia: item.Gunia,
      Mafuta: item.Mafuta,
      collectionId: item.collectionId,
      collectionName: item.collectionName,
      created: item.created,
      updated: item.updated,
      expand: {
        CustomerId: {
          Name: item.expand?.CustomerId?.Name??'',
          PhoneNumber: item.expand?.CustomerId?.PhoneNumber ?? '',
          collectionId: item.expand?.CustomerId?.collectionId??'',
          collectionName: item.expand?.CustomerId?.collectionName??'',
          created: item.expand?.CustomerId?.created??'',
          id: item.expand?.CustomerId?.id??'',
          updated: item.expand?.CustomerId?.updated??'',
        }
      }
    })));
    // setCustomers([{
    //   CustomerId: 2,
    //   Date: "2024-09-29 12:00:00.000Z",
    //   Gunia: 100,
    //   Mafuta: 110,
    //   collectionId: "wmnpd1t4re9eu5m",
    //   collectionName: "Stocks",
    //   created: "2024-09-29 19:53:09.585Z",
    //   expand: {
    //     CustomerId: {
    //       Name: "Noel Rite",
    //       PhoneNumber: "0678787888",
    //       collectionId: "386t850jhas4f8e",
    //       collectionName: "Customers",
    //       created: "2024-09-29 19:44:08.928Z",
    //       id: "z181q9strqg8zsm",
    //       updated: "2024-09-29 19:44:08.928Z"
    //     }
    //   },
    //   "id": "1",
    //   "updated": "2024-09-29 19:53:09.585Z"
    // },{
    //   CustomerId: 3,
    //   Date: "2024-09-29 12:00:00.000Z",
    //   Gunia: 100,
    //   Mafuta: 110,
    //   collectionId: "wmnpd1t4re9eu5m",
    //   collectionName: "Stocks",
    //   created: "2024-09-29 19:53:09.585Z",
    //   expand: {
    //     CustomerId: {
    //       Name: "Noel Rite",
    //       PhoneNumber: "0678787888",
    //       collectionId: "386t850jhas4f8e",
    //       collectionName: "Customers",
    //       created: "2024-09-29 19:44:08.928Z",
    //       id: "z181q9strqg8zsm",
    //       updated: "2024-09-29 19:44:08.928Z"
    //     }
    //   },
    //   "id": "2",
    //   "updated": "2024-09-29 19:53:09.585Z"
    // },{
    //   CustomerId: 4,
    //   Date: "2024-09-29 12:00:00.000Z",
    //   Gunia: 100,
    //   Mafuta: 110,
    //   collectionId: "wmnpd1t4re9eu5m",
    //   collectionName: "Stocks",
    //   created: "2024-09-29 19:53:09.585Z",
    //   expand: {
    //     CustomerId: {
    //       Name: "Noel Rite",
    //       PhoneNumber: "0678787888",
    //       collectionId: "386t850jhas4f8e",
    //       collectionName: "Customers",
    //       created: "2024-09-29 19:44:08.928Z",
    //       id: "z181q9strqg8zsm",
    //       updated: "2024-09-29 19:44:08.928Z"
    //     }
    //   },
    //   "id": "3",
    //   "updated": "2024-09-29 19:53:09.585Z"
    // }]);
  };


  useEffect(() => {
    getCustomers();
    console.log('getting data')
  }, []);

  useEffect(() => {
    console.log(customers);
    console.log(transformedCustomers)  // This will log the updated customers after state change
  }, [customers]);

        const transformedCustomers = customers.map((customer)  => ({
          id: customer.id,
          CustomerId: customer.CustomerId,
          Date: customer.Date.toString(),
          Gunia: Number(customer.Gunia),
          Mafuta: Number(customer.Mafuta),
          collectionId: customer.collectionId,
          collectionName: customer.collectionName,
          created: customer.created.toString(),
          updated: customer.updated.toString(),
          expand: {
            CustomerId: {
              Name: customer.expand.CustomerId.Name,
              PhoneNumber: customer.expand.CustomerId.PhoneNumber,
              collectionId: customer.expand.CustomerId.collectionId,
              collectionName: customer.expand.CustomerId.collectionName,
              created: customer.expand.CustomerId.created.toString(),
              id: customer.expand.CustomerId.id,
              updated: customer.expand.CustomerId.updated.toString(),
            }
          }
        }));
  
  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header sticky>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      <Layout.Body>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Kibaigwa Oil Production</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of Sacks received and oil produced.
            </p>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <DataTable data={transformedCustomers} columns={columns} />
        </div>
      </Layout.Body>
    </Layout>
  )
}
