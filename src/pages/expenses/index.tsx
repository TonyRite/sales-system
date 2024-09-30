import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { DataTable } from './components/data-table'
import { columns } from './components/columns'
import pb from '@/api/Pocketbase'
import { useEffect, useState } from 'react'
export interface ExpenseRecord {
  Date_Incurred: string;     // Date when the expense was incurred
  Name: string;              // Name of the expense item
  Price: number;             // Price of the expense
  Quantity: number;          // Quantity of the expense
  id: number;                // Unique identifier for the expense record          // Last updated date of the record
}



export default function Tasks() {
// remove task,refactor reuse
  const [Expenses, setExpenses] = useState<ExpenseRecord[]>([]);

  const getExpenses = async () => {
    pb.autoCancellation(false);
    const customers = await pb.collection('Expenses').getList(1, 50, {});
    setExpenses(customers.items.map((item,index) => ({
      id: (index+1),
      Name: item.Name,
      Price: item.Price,
      Quantity: item.Quantity,
      Date_Incurred: item.Date_Incurred,
    })));
  };

  useEffect(() => {
    getExpenses();
  }, []);

  // Transform the customers to match the expected format for DataTable
  const transformedExpense = Expenses.map(Expense => ({
    id: Expense.id, 
    Name: Expense.Name,
    Price: Expense.Price,
    Quantity: Expense.Quantity, 
    Date_Incurred: Expense.Date_Incurred.toString(), 
  }));

  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header sticky>
        {/* <Search /> */}
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
              Here&apos;s a list of Expenses.
            </p>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <DataTable data={ transformedExpense} columns={columns} />
        </div>
      </Layout.Body>
    </Layout>
  )
}
