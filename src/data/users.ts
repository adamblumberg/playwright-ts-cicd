/** Test users for practicesoftwaretesting.com */
export const users = {
  customer: {
    email: 'customer@practicesoftwaretesting.com',
    password: 'welcome01',
    firstName: 'Jane',
    lastName: 'Doe',
  },
  admin: {
    email: 'admin@practicesoftwaretesting.com',
    password: 'welcome01',
  },
  invalidCredentials: {
    email: 'nobody@example.com',
    password: 'wrongpassword',
  },
} as const;
