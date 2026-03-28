/** Test users for practicesoftwaretesting.com */
export const users = {
  customer: {
    email: 'customer@practicesoftwaretesting.com',
    password: 'welcome01',
    firstName: 'Jane',
    lastName: 'Doe',
    address: {
      street: '123 Main Street',
      city: 'Amsterdam',
      state: 'North Holland',
      country: 'Netherlands',
      postal_code: '1234 AB',
    },
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
