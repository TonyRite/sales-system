import { Layout } from '@/components/custom/layout';
import ThemeSwitch from '@/components/theme-switch';
import { UserNav } from '@/components/user-nav';
import { DataTable } from './components/data-table';
import { columns } from './components/columns';
import pb from '@/api/Pocketbase';
import { useEffect, useState } from 'react';
import { InputForm } from './ExpensesForm';
import { TopNav } from '@/components/top-nav';
import { topNav } from '../dashboard';
import { useLocation } from 'react-router-dom';
import Loader from '@/components/loader';
import { toast } from '@/components/ui/use-toast';

export interface ExpenseRecord {
  Date_Incurred: string;     // Date when the expense was incurred
  Name: string;              // Name of the expense item
  Price: number;             // Price of the expense
  Quantity: number;          // Quantity of the expense
  Cid: number; 
  id:string;               // Unique identifier for the expense record
}

export default function Tasks() {
  const [Expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  // Fetch expenses from the API
  const getExpenses = async () => {
    try {
      pb.autoCancellation(false);
  
      // Fetch expenses data (page 1, limit 50)
      const customers = await pb.collection('Expenses').getList(1, 50, {});
  
      // Check if data was retrieved
      if (customers && customers.items.length > 0) {
        // Map and transform the data into a usable format
        const expensesData = customers.items.map((item, index) => ({
          Cid: index + 1,
          id: item.id,
          Name: item.Name,
          Price: item.Price,
          Quantity: item.Quantity,
          Date_Incurred: item.Date_Incurred,
        }));
  
        // Update state with the fetched data
        setExpenses(expensesData);
  
        // Stop loading only if data is successfully fetched
        setLoading(false);
      } else {
        // If no data is retrieved, keep loading active
        console.warn("No data retrieved, keeping loading active.");
        toast({
          title: "Hakuna Taarifa",
          description: "Hakuna data zilizopatikana, tafadhali jaribu tena baadaye.",
          variant: "destructive",
        });
      }
    } catch (e) {
      console.error("Error fetching expenses data:", e);
      toast({
        title: "Tatizo",
        description: "Kuna tatizo la kiufundi",
        variant: "destructive",
      });
      // Do not stop loading in case of API failure
    }
  };
  

  // Fetch data on component mount
  useEffect(() => {
    getExpenses();
  }, []);

  // Transform the customers to match the expected format for DataTable
  const transformedExpense = Expenses.map(Expense => ({
    id: Expense.id,
    Cid:Expense.Cid,
    Name: Expense.Name,
    Price: Expense.Price,
    Quantity: Expense.Quantity,
    Date_Incurred: Expense.Date_Incurred.toString(),
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
            <h2 className='text-2xl font-bold tracking-tight'>Expenses General</h2>
            <p className='text-muted-foreground'>
              Here's a list of Expenses.
            </p>
          </div>
          {/* Pass the getExpenses function as a prop to refresh the data after form submission */}
          <InputForm onClose={getExpenses} />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
        {loading?
          <Loader/>:
          <DataTable data={transformedExpense} columns={columns(getExpenses)} />
          }
        </div>
      </Layout.Body>
    </Layout>
  );
}


