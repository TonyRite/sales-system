import { Layout } from '@/components/custom/layout'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent} from '@/components/ui/tabs'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { TopNav } from '@/components/top-nav'
import { useEffect, useState} from 'react'
import { renderCanvas } from './rendercanvas'
import { renderCanvasFlower } from './sunFlower'
import pb from '@/api/Pocketbase'
import { toast } from '@/components/ui/use-toast'
import { DatePickerWithRange } from './DatePickerWithRange'
import { useLocation } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
export default function Dashboard() {
  const location = useLocation();
  const [loading ,setLoading] = useState(true);
  const [sums, setSums] = useState({
    totalAmount: 0,
    totalGunia: 0,
    totalMafuta: 0,
    totalExpense:0
  });
  // Update the topNav to set isActive based on the current pathname
  const updatedNav = topNav.map(link => ({
    ...link,
    isActive: location.pathname === link.href ? true : false,
  }));
  const getLoans = async (filterDates: { startDate: any; endDate: any } | undefined) => {
    try {
      pb.autoCancellation(false);
  
      // Set up the filter string based on the input
      let loanFilter = '';
      if (filterDates && filterDates.startDate && filterDates.endDate) {
        loanFilter = `created >= '${filterDates.startDate}' && created <= '${filterDates.endDate}'`;
      }
  
      // Fetch loans data with optional date filters
      let loanData = await pb.collection('Loans').getFullList({
        filter: loanFilter
      });
      const sumOfAmounts = loanData.length
        ? loanData.reduce((sum, item) => sum + item.Amount, 0)
        : 0;
  
      // Fetch stocks data
      let stocksData = await pb.collection('Stocks').getFullList({ filter: loanFilter });
      const guniaSum = stocksData.length
        ? stocksData.reduce((sum, item) => sum + item.Gunia, 0)
        : 0;
      const mafutaSum = stocksData.length
        ? stocksData.reduce((sum, item) => sum + item.Mafuta, 0)
        : 0;
  
      // Fetch expenses data
      let expensesData = await pb.collection('Expenses').getFullList({ filter: loanFilter });
      const expenseSum = expensesData.length
        ? expensesData.reduce((sum, item) => sum + item.Price, 0)
        : 0;
  
      console.log(expensesData);
  
      // Update state with the calculated sums
      setSums({
        totalAmount: sumOfAmounts,
        totalGunia: guniaSum,
        totalMafuta: mafutaSum,
        totalExpense: expenseSum
      });
  
      // Set loading to false only when all data has been successfully fetched
      setLoading(false);
  
      toast({
        title: "Karibu",
        description: "Mali Bila Daftari huisha bila......",
        variant: "default"
      });
  
    } catch (e) {
      // In case of error, display a toast message and keep the loading state true
      console.error("Error fetching data: ", e);
      toast({
        title: "Tatizo",
        description: "Kuna tatizo",
        variant: "destructive"
      });
    }
  };
      
     
      useEffect(() => {
       
          // Initial load logic
          getLoans(undefined);
    
          const randomChoice = Math.floor(Math.random() * 2) + 1;
          if (randomChoice === 1) {
            renderCanvas();
          } else {
            renderCanvasFlower();
          }
    
      }, []);


  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header>
        {/* removed top Nav links since they have no use here ,untill further notice */}
        <TopNav links={updatedNav} />
        <div className='ml-auto flex items-center space-x-4'>
          {/* <Search /> */}
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      {/* ===== Main ===== */}
      <Layout.Body>
        <div className='mb-2 flex items-center justify-between space-y-2'>
        <canvas className="bg-skin-base pointer-events-none absolute inset-0" id="canvas"></canvas>
          <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
          <div className='flex items-center space-x-2'>
          <DatePickerWithRange getLoans={getLoans} />
          </div>
        </div>
        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
             <h3 className='text-xl tracking-tight italic'>Taarifa Hizi ni za Tangia kuanza kazi ,lakini unaweza angalia taarifa kwa tarehe hapo pembeni </h3>
          </div>


          {/* Overview data */}
          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-2'>
              {loading?
              <Card>
              {/* <div className="flex flex-col space-y-5"> */}
              <div className='flex flex-col space-y-2 h-full w-full justify-center items-start p-2'>
              <Skeleton className="h-5 w-[200px] rounded-xl" />
              <Skeleton className="h-5 w-[350px] rounded-xl" />
              <Skeleton className="h-5 w-[450px] rounded-xl" />
              </div>
               {/* </div> */}
            </Card>:
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-lg font-medium'>
                    Jumla Ya Malipo Ya Ukamuaji
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='h-4 w-4 text-muted-foreground'
                  >
                    <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
                  </svg>
                </CardHeader>
                <CardContent>
                   <div className='text-4xl font-bold md:text-5xl italic lg:text-6xl'>TSh {((sums.totalGunia)*7000).toLocaleString()}</div>
                  <p className='text-xl font-semibold text-muted-foreground'>
                    Tsh 7000 kwa Gunia Moja
                  </p>
                </CardContent>
              </Card>
              
              }
              {loading? 
               <Card>
              {/* <div className="flex flex-col space-y-5"> */}
              <div className='flex flex-col space-y-2 h-full w-full justify-center items-start p-2'>
              <Skeleton className="h-5 w-[200px] rounded-xl" />
              <Skeleton className="h-5 w-[350px] rounded-xl" />
              <Skeleton className="h-5 w-[450px] rounded-xl" />
              </div>
               {/* </div> */}
            </Card>
            :
            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-lg font-medium'>
                    Jumla Ya Mikopo
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='h-4 w-4 text-muted-foreground'
                  >
                    <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
                    <circle cx='9' cy='7' r='4' />
                    <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-4xl font-bold md:text-6xl italic'>TSh {sums.totalAmount.toLocaleString()}</div>
                  <p className='text-xl font-semibold text-muted-foreground'>
                    Hii ni jumla ya mikopo iliyowahi kutolewa
                  </p>
                </CardContent>
            </Card>}
              {loading?<Card>
              {/* <div className="flex flex-col space-y-5"> */}
              <div className='flex flex-col space-y-2 h-full w-full justify-center items-start p-2'>
              <Skeleton className="h-5 w-[200px] rounded-xl" />
              <Skeleton className="h-5 w-[350px] rounded-xl" />
              <Skeleton className="h-5 w-[450px] rounded-xl" />
              </div>
               {/* </div> */}
            </Card>:<Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-lg font-medium'>Jumla Ya Magunia Yaliyoingia Mashineni</CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='h-4 w-4 text-muted-foreground'
                  >
                    <rect width='20' height='14' x='2' y='5' rx='2' />
                    <path d='M2 10h20' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-4xl font-bold md:text-6xl'> Gunia: {sums.totalGunia.toLocaleString()}</div>
                  <p className='text-xl font-semibold text-muted-foreground'>
                    Magunia yote Tangia Kuanza kwa ukamulishaji
                  </p>
                </CardContent>
              </Card>
              }
              {
                loading?
                <Card>
                {/* <div className="flex flex-col space-y-5"> */}
                <div className='flex flex-col space-y-2 h-full w-full justify-center items-start p-2'>
                <Skeleton className="h-5 w-[200px] rounded-xl" />
                <Skeleton className="h-5 w-[350px] rounded-xl" />
                <Skeleton className="h-5 w-[450px] rounded-xl" />
                </div>
                 {/* </div> */}
              </Card>:
                <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-lg font-medium'>
                   Jumla Ya Mafuta yaliyotengenezwa
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='h-4 w-4 text-muted-foreground'
                  >
                    <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-4xl font-bold md:text-6xl'>Dumu: {sums.totalMafuta.toLocaleString()}</div>
                  <p className='text-xl font-semibold text-muted-foreground'>
                    Dumu zilizopatikana toka kuanza kazi
                  </p>
                </CardContent>
              </Card>
              } 
              {loading?
              <Card>
              {/* <div className="flex flex-col space-y-5"> */}
              <div className='flex flex-col space-y-2 h-full w-full justify-center items-start p-2'>
              <Skeleton className="h-5 w-[200px] rounded-xl" />
              <Skeleton className="h-5 w-[350px] rounded-xl" />
              <Skeleton className="h-5 w-[450px] rounded-xl" />
              </div>
               {/* </div> */}
            </Card>:
              <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-lg font-medium'>
                 Jumla Ya Gharama za uendeshaji
                </CardTitle>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  className='h-4 w-4 text-muted-foreground'
                >
                  <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
                </svg>
              </CardHeader>
              <CardContent>
                <div className='text-4xl font-bold md:text-6xl '>Tsh {sums.totalExpense.toLocaleString()}</div>
                <p className='text-xl font-semibold text-muted-foreground'>
                  Gharama za uendeshaji
                </p>
              </CardContent>
            </Card>
            }            
            </div>
          </TabsContent>
        </Tabs>
      </Layout.Body>
    </Layout>
  )
}

// no use for the data for top nav links at the moment 
export const topNav = [
  {
    title: 'Overview',
    href: '/',
    
  },
  {
    title: 'Mafuta Kiwandani',
    href: '/OilProduced',
   
  },
  {
    title: 'Mafuta Yaliyoenda Mbeya',
    href: '/Mbeya',
   
  },
  {
    title: 'Matumizi',
    href: '/expenses',
   
  },
  {
    title: 'Mikopo',
    href: '/Loans',
    
  },
]
