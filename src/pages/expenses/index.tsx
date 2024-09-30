import { Layout } from '@/components/custom/layout';
import ThemeSwitch from '@/components/theme-switch';
import { UserNav } from '@/components/user-nav';
import { DataTable } from './components/data-table';
import { columns } from './components/columns';
import pb from '@/api/Pocketbase';
import { useEffect, useState } from 'react';
import { InputForm } from './ExpensesForm';

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

  // Fetch expenses from the API
  const getExpenses = async () => {
    pb.autoCancellation(false);
    const customers = await pb.collection('Expenses').getList(1, 50, {});
    setExpenses(customers.items.map((item, index) => ({
      Cid: index + 1,
      id:item.id,
      Name: item.Name,
      Price: item.Price,
      Quantity: item.Quantity,
      Date_Incurred: item.Date_Incurred,
    })));
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
            <h2 className='text-2xl font-bold tracking-tight'>Expenses General</h2>
            <p className='text-muted-foreground'>
              Here's a list of Expenses.
            </p>
          </div>
          {/* Pass the getExpenses function as a prop to refresh the data after form submission */}
          <InputForm onClose={getExpenses} />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <DataTable data={transformedExpense} columns={columns} />
        </div>
      </Layout.Body>
    </Layout>
  );
}
