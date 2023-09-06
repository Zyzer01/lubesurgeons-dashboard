import { ApexOptions } from 'apexcharts';
import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { supabase } from '../config/supabaseClient';

interface BookingData {
  service: string;
  servicePrices: number;
  date: string;
  paymentStatus: string;
}

interface AdminSaleState {
  series: {
    name: string;
    data: number[];
  }[];
}

const options: ApexOptions = {
  legend: {
    show: false,
    position: 'top',
    horizontalAlign: 'left',
  },
  colors: ['#3C50E0', '#80CAEE'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    height: 335,
    type: 'area',
    dropShadow: {
      enabled: true,
      color: '#623CEA14',
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },

    toolbar: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350,
        },
      },
    },
  ],
  stroke: {
    width: [2, 2],
    curve: 'straight',
  },
  // labels: {
  //   show: false,
  //   position: "top",
  // },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 4,
    colors: '#fff',
    strokeColors: ['#3056D3', '#80CAEE'],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    hover: {
      size: undefined,
      sizeOffset: 5,
    },
  },
  xaxis: {
    type: 'category',
    categories: [
      'Sep',
      'Oct',
      'Nov',
      'Dec',
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
    ],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    title: {
      style: {
        fontSize: '0px',
      },
    },
    min: 0,
    max: 100,
  },
};

const AdminSalesChart: React.FC = () => {
  const [state, setState] = useState<AdminSaleState>({
    series: [],
  });

  // Function to format a date in "DD.MM.YYYY" format
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const nextYear = currentYear + 1;

  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const currentDay = currentDate.getDate().toString().padStart(2, '0');

  useEffect(() => {
    // Fetch data from the Supabase table
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('service, servicePrice, date, paymentStatus')
        .eq('paymentStatus', 'successful')
        .limit(1000);

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        // Organize data into series format dynamically
        const uniqueServices = [...new Set(data.map((item) => item.service))];
        const seriesData = uniqueServices.map((service) => {
          const serviceData = data.filter((item) => item.service === service);
          const servicePrice = serviceData.map((item) => item.servicePrice);
          return {
            name: service,
            data: servicePrice,
          };
        });

        // Update the chart's state
        setState({
          series: seriesData,
        });
      }
    };

    // Call fetchData to fetch and process the data
    fetchData();
  }, []);

  return (
    <>
      <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-6">
        <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
          <div className="flex w-full flex-wrap gap-3 sm:gap-5">
            {state.series.map((item, index) => (
              <div className="flex min-w-47.5" key={index}>
                <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
                  <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
                </span>
                <div className="w-full">
                  <p className="font-semibold text-primary">{`Total ${item.name} Sales`}</p>
                  <p className="text-sm font-medium">{`${currentDay}.${currentMonth}.${currentYear} - ${currentDay}.${currentMonth}.${nextYear}`}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex w-full max-w-45 justify-end">
            <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
              <button className="rounded bg-white py-1 px-3 text-xs font-medium text-black shadow-card hover:bg-white hover:shadow-card dark:bg-boxdark dark:text-white dark:hover:bg-boxdark">
                Day
              </button>
              <button className="rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark">
                Week
              </button>
              <button className="rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark">
                Month
              </button>
            </div>
          </div>
        </div>

        <div>
          <div id="Adminsale" className="-ml-5">
            <ReactApexChart
              options={options}
              series={state.series}
              type="area"
              height={350}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSalesChart;
