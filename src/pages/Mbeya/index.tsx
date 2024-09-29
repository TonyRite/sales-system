import { Layout } from '@/components/custom/layout'

import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { DataTable } from './components/data-table'
import { columns } from './components/columns'
import pb from '@/api/Pocketbase'
import { useEffect, useState } from 'react'
export interface RecordModel {
  // Define the properties of the RecordModel type here
  id:string;
  name:string;
  phone: string,
  money: number,
  Gunia:number,
  Date_entered: string,
}

export default function Tasks() {

  const [Customers, setCustomers] = useState<RecordModel[]>([]);

  const getCustomers = async () => {
    pb.autoCancellation(false);
    const customers = await pb.collection('deni').getList(1, 50, {});
    setCustomers(customers.items.map((item) => ({
      id:item.id,
      name: item.Name,
      phone: item.Phone_Number,
      money: item.Money_Amount,
      Gunia: item.Gunia,
      Date_entered: item.Date_entered,
    })));
  };

  useEffect(() => {
    getCustomers();
  }, []);

  // Transform the customers to match the expected format for DataTable
  const transformedCustomers = Customers.map(customer => ({
    id: customer.id, // assuming 'phone' can be used as a unique identifier
    name: customer.name,
    phone: customer.phone,
    money: customer.money.toString(), // Assuming status is related to money
    Gunia: customer.Gunia.toString(),
    Date_entered: customer.Date_entered.toString(), // Assuming priority is related to Gunia
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
            <h2 className='text-2xl font-bold tracking-tight'>Mbeya Sent Oil</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of Oil sent to Mbeya
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
