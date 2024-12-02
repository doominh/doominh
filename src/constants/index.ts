export const colorsCharts = {
  pink: '#ff4757',
  orange: '#ff6348',
  yellow: '#eccc68',
  purple: '#9980FA',
  cyan: '#33d9b2'
};

export const tableData: Array<object> = [
  {
    count: 5,
    time: 'September 17, 2024',
    hour: '9:41 AM'
  },
  {},
  {},
  {},
  {},
  {
    count: 5,
    time: 'September 17, 2024',
    hour: '9:41 AM'
  },
  {},
  {},
  {},
  {},
  {},
  {},
  {
    count: 5,
    time: 'September 17, 2024',
    hour: '9:41 AM'
  },
  {},
  {},
  {},
  {},
  {},
  {},
  {
    count: 5,
    time: 'September 17, 2024',
    hour: '9:41 AM'
  },
  {},
  {},
  {},
  {},
  {},
  {},
  {
    count: 5,
    time: 'September 17, 2024',
    hour: '9:41 AM'
  },
  {},
  {},
  {},
  {},
  {},
  {},
  {
    count: 5,
    time: 'September 17, 2024',
    hour: '9:41 AM'
  },
  {
    count: 5,
    time: 'September 17, 2024',
    hour: '9:41 AM'
  },
  {},
  {},
  {},
  {},
  {},
  {},
  {
    count: 5,
    time: 'September 17, 2024',
    hour: '9:41 AM'
  },
  {},
  {},
  {},
  {},
  {},
  {},
  {
    count: 5,
    time: 'September 17, 2024',
    hour: '9:41 AM'
  }
];

export default colorsCharts;

export enum ROLE {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
  CHEF = 'chef',
  EMPLOYEE = 'employee'
}

export enum StatusEnum {
  ACTIVE = '1',
  INACTIVE = '0'
}

export const lngs = {
  en: { key: 'en', nativeName: 'English', countryCode: 'US' },
  vi: { key: 'vi', nativeName: 'Tiếng Việt', countryCode: 'VN' }
};

export const chefData = [
  {
    table_id: 1,
    created_date: '2024-04-21T15:26:16.861Z',
    updated_date: '2024-04-21T15:26:16.861Z',
    orders: [
      {
        bill_id: '1',
        food_name: 'Phở gà',
        price: 50000,
        quantity: 1,
        note: 'Không ớt',
        status: 1
      },
      {
        bill_id: '2',
        food_name: 'Gỏi cuốn',
        price: 30000,
        quantity: 2,
        note: '',
        status: 1
      }
    ]
  },
  {
    table_id: 2,
    created_date: '2024-04-21T15:26:16.861Z',
    updated_date: '2024-04-21T15:26:16.861Z',
    orders: [
      {
        bill_id: '3',
        food_name: 'Bún chả',
        price: 60000,
        quantity: 1,
        note: 'Ít mỡ',
        status: 1
      },
      {
        bill_id: '4',
        food_name: 'Cơm rang dưa bò',
        price: 70000,
        quantity: 1,
        note: '',
        status: 1
      }
    ]
  },
  {
    table_id: 10,
    created_date: '2024-04-21T15:26:16.861Z',
    updated_date: '2024-04-21T15:26:16.861Z',
    orders: [
      {
        bill_id: '19',
        food_name: 'Bánh mì pate',
        price: 25000,
        quantity: 3,
        note: 'Thêm trứng',
        status: 1
      },
      {
        bill_id: '20',
        food_name: 'Trà đá',
        price: 10000,
        quantity: 2,
        note: '',
        status: 1
      }
    ]
  }
];
