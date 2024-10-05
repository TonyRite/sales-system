import { Layout } from '@/components/custom/layout'

import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { DataTable } from './components/data-table'
import { columns } from './components/columns'
import pb from '@/api/Pocketbase'
import { useEffect, useState } from 'react'
import { InputForm } from './MbeyaForm'
import { TopNav } from '@/components/top-nav'
import { topNav } from '../dashboard'
import { useLocation } from 'react-router-dom'
import { toast } from '@/components/ui/use-toast'
import Loader from '@/components/loader'

export interface SalesRecord {
  Car_Drive_Names: string;   // Name associated with the car drive
  Date_Sent: string;         // Date when the data was sent
  Quantity: number;          // Quantity related to the sale
  id: string;                // Unique identifier for the record
  Did:number
}


export default function Tasks() {
  const [loading, setLoading] = useState(true);
  const [Sales, setSales] = useState<SalesRecord[]>([]);

  const getSales = async () => {
   try{
    pb.autoCancellation(false);
    const customers = await pb.collection('Sales').getList(1, 50, {});
   if(customers && customers.items.length > 0){
    const customerData = customers.items.map((item, index) => ({
      Did: (index + 1), 
      id:item.id,
      Car_Drive_Names: item.Car_Drive_Names,   
      Date_Sent: item.Date_Sent,               
      Quantity: item.Quantity,                
    }));
    setSales(customerData); 
    setLoading(false); 
   }else{
      // If no data is retrieved, keep loading active
      console.warn("No data retrieved, keeping loading active.");
      toast({
        title: "Hakuna Taarifa",
        description: "Hakuna data zilizopatikana, tafadhali jaribu tena baadaye.",
        variant: "destructive",
      });
   }    
   }catch(e){
    toast({
      title: "Tatizo",
      description:`Kuna tatizo la kiufundi`,
      variant: "destructive",
    });
   }
  };

  useEffect(() => {
    getSales();
  }, []);

  // Transform the customers to match the expected format for DataTable
  const transformedCustomers = Sales.map(sale => ({
    Did:sale.Did,
    id:sale.id,                            // Unique identifier for the sales record
    Car_Drive_Names: sale.Car_Drive_Names, // Mapping the car drive names
    Date_Sent: sale.Date_Sent,             // Mapping the date when the data was sent
    Quantity: sale.Quantity,                 // Mapping the quantity sold
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
            <h2 className='text-2xl font-bold tracking-tight'>Mbeya Sent Oil</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of Oil sent to Mbeya
            </p>
          </div>
          <InputForm onClose={getSales} />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
        {loading?
          <Loader/>:
          <DataTable data={transformedCustomers} columns={columns(getSales)} />
          }
        </div>
      </Layout.Body>
    </Layout>
  )
}

