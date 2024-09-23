import pb from '@/api/Pocketbase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useEffect, useState } from 'react';
import { custom } from 'zod';

interface RecordModel {
  // Define the properties of the RecordModel type here
  name:string;
  phone: string,
  money: number
}
type Customer = {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  Name: string;
  Phone_Number: string;
  Money_Amount: number;
};

export function RecentSales() {
  const [Customers, setCustomers] = useState<RecordModel[]>([]);
  const getCustomers = async()=>{
    pb.autoCancellation(false);
    const customers = await pb.collection('customers').getList(1, 50, {
    });
    setCustomers(customers.items.map((item) => ({ 
      name: item.Name,
      phone: item.Phone_Number,
      money: item.Money_Amount
    })));
    console.log(Customers);
  }
  useEffect(() => {getCustomers()}, []);
  return (
    <div className='space-y-8'>
      {Customers.map((customer, index) => <div className='flex items-center'>
        <Avatar className='h-9 w-9'>
          <AvatarImage src='/avatars/01.png' alt='Avatar' />
          <AvatarFallback>OM</AvatarFallback>
        </Avatar>
        <div className='ml-4 space-y-1'>
          <p className='text-sm font-medium leading-none'>{customer.name}</p>
          <p className='text-sm text-muted-foreground'>
            {customer.phone}
          </p>
        </div>
        <div className='ml-auto font-medium'>TSh {customer.money}</div>
      </div>
    )}
    </div>
  )
}
