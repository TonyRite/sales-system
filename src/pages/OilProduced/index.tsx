import { Layout } from '@/components/custom/layout'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { DataTable } from './components/data-table'
import { columns } from './components/columns'
import pb from '@/api/Pocketbase'
import { useEffect, useState } from 'react'
import { InputForm } from './KibaigwaForm'
import { useLocation } from 'react-router-dom'
import { topNav } from '../dashboard'
import { TopNav } from '@/components/top-nav'
import { toast } from '@/components/ui/use-toast'
import Loader from '@/components/loader'

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
  id: string;
  Cid:number;
  updated: string;
}


export default function Tasks() {
// remove task ,refactor reuse 
  const [customers, setCustomers] = useState<CustomerRecordModel[]>([]);
  const [loading, setLoading] = useState(true);

  const getCustomers = async () => {
    try{
      setLoading(true);
      pb.autoCancellation(false);
    const customersData = await pb.collection('Stocks').getList(1, 50, {expand:'CustomerId'});
    setCustomers(customersData.items.map((item,index) => ({
      id:item.id,
      Cid: (index + 1),
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
    setLoading(false);
    }catch(e){
      setLoading(false);
      toast({
        title: "Tatizo",
        description:`Kuna tatizo la kiufundi`,
        variant: "destructive",
      });
    }
  };


  useEffect(() => {
    getCustomers();
    console.log('getting data')
  }, []);

        const transformedCustomers = customers.map((customer)  => ({
          Cid: customer.Cid,
          id:customer.id,
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
  

        const location = useLocation();

        // Update the topNav to set isActive based on the current pathname
        const updatedNav = topNav.map(link => ({
          ...link,
          isActive: location.pathname === link.href ? true : false,
        }));
      
        return (
          <Layout>
            {/* ===== Top Heading ===== */}
            <Layout.Header sticky>
            <TopNav links={updatedNav} />
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
          <InputForm onClose={getCustomers}/>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {loading?
          <Loader/>:
          <DataTable data={transformedCustomers} columns={columns} />
          }
        </div>
      </Layout.Body>
    </Layout>
  )
}
