import { Layout } from '@/components/custom/layout'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { DataTable } from './components/data-table'
import { columns } from './components/columns'

import pb from '@/api/Pocketbase'
import { useEffect, useState } from 'react'
import { CustomerDetails } from '../OilProduced'
import { InputForm } from './LoansForm'
import { TopNav } from '@/components/top-nav'
import { topNav } from '../dashboard'
import { useLocation } from 'react-router-dom'
import { toast } from '@/components/ui/use-toast'
export interface RecordModel {
  // Define the properties of the RecordModel type here
  id:string;
  name:string;
  phone: string,
  money: number,
  Gunia:number,
  Date_entered: string,
}

export interface LoanRecord {
  Amount: number;              // Amount of the loan
  CustomerId: string;          // ID of the customer associated with the loan
  DateIssued: string;          // Date when the loan was issued
  DueDate: string;             // Due date for the loan repayment
  Status: string;              // Status of the loan (e.g., "Not Paid")
  collectionId: string;        // ID of the collection
  collectionName: string;      // Name of the collection (e.g., "Loans")
  created: string;             // Creation date of the loan record
  expand: {
    CustomerId: CustomerDetails; // Expanded customer details
  };
  Cid: number;
  id:string;                  // Unique identifier for the loan record
  updated: string;             // Last updated date of the loan record
}

export default function Tasks() {

  const [Loans, setLoans] = useState<LoanRecord[]>([]);

  const getLoans = async () => {
    try{
      pb.autoCancellation(false);
    const customers = await pb.collection('Loans').getList(1, 50, {expand:'CustomerId'});
    setLoans(customers.items.map((item,index) => ({
      Cid: (index+1),
      id:item.id,
      CustomerId: item.CustomerId,                // Assuming you want to keep the CustomerId
      DateIssued: item.DateIssued,                  // Assuming you're getting the DateIssued
      DueDate: item.DueDate,                        // Assuming you're getting the DueDate
      Amount: item.Amount,                          // The amount of the loan
      Status: item.Status,                          // The status of the loan
      collectionId: item.collectionId,              // Collection ID for the loan
      collectionName: item.collectionName,          // Name of the collection
      created: item.created,                        // Creation date of the loan record
      updated: item.updated,                        // Last updated date of the loan record
      expand: {
        CustomerId: {
          Name: item.expand?.CustomerId?.Name ?? '',          // Customer name, default to empty string if not available
          PhoneNumber: item.expand?.CustomerId?.PhoneNumber ?? '', // Customer phone number, default to empty string if not available
          collectionId: item.expand?.CustomerId?.collectionId ?? '', // Customer collection ID, default to empty string if not available
          collectionName: item.expand?.CustomerId?.collectionName ?? '', // Customer collection name, default to empty string if not available
          created: item.expand?.CustomerId?.created ?? '',                // Customer creation date, default to empty string if not available
          id: item.expand?.CustomerId?.id ?? '',                          // Customer ID, default to empty string if not available
          updated: item.expand?.CustomerId?.updated ?? '',                // Customer last updated date, default to empty string if not available
        }
      }
    })));
    }catch(e){
      toast({
        title: "Tatizo",
        description:`Kuna tatizo la kiufundi`,
        variant: "destructive",
      });
    }
  };


  useEffect(() => {
    getLoans();
  }, []);

  // Transform the customers to match the expected format for DataTable
  const transformedCustomers = Loans.map(loan => ({
    Cid: loan.Cid,
    id:loan.id,                                   // Unique identifier for the loan record
    CustomerId: loan.CustomerId,                   // Customer ID associated with the loan
    DateIssued: loan.DateIssued,                   // Date when the loan was issued
    DueDate: loan.DueDate,                         // Due date for loan repayment
    Amount: loan.Amount,                // Amount of the loan as a string
    Status: loan.Status,                            // Current status of the loan
    collectionId: loan.collectionId,               // Collection ID for the loan
    collectionName: loan.collectionName,           // Name of the collection
    created: loan.created,                          // Creation date of the loan record
    updated: loan.updated,                          // Last updated date of the loan record
    expand: {
      CustomerId: {
        Name: loan.expand.CustomerId.Name,        // Name of the customer
        PhoneNumber: loan.expand.CustomerId.PhoneNumber, // Phone number of the customer
        collectionId: loan.expand.CustomerId.collectionId, // Customer's collection ID
        collectionName: loan.expand.CustomerId.collectionName, // Customer's collection name
        created: loan.expand.CustomerId.created,   // Customer's creation date
        id: loan.expand.CustomerId.id,             // Customer's ID
        updated: loan.expand.CustomerId.updated,    // Last updated date for the customer record
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
            <h2 className='text-2xl font-bold tracking-tight'>Mikopo</h2>
            <p className='text-muted-foreground'>
             Here&apos;s a list of loans you provided
            </p>
          </div>
          <InputForm onClose={getLoans}/>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <DataTable data={transformedCustomers} columns={columns} />
        </div>
      </Layout.Body>
    </Layout>
  )
}


