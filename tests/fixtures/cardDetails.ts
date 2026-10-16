//I want to import faker to populate card details (number, expiry date, cvv) and also an email and address fields
import { faker } from '@faker-js/faker';

export const cardDetails = {
  number: faker.finance.creditCardNumber(),
  expiryDate: '12/30',
  cvv: faker.finance.creditCardCVV(),
  email: faker.internet.email(),
  address: faker.location.streetAddress(),
  addressLine2: faker.location.secondaryAddress(),
  city: faker.location.city(),
  postcode: faker.location.zipCode(),
  name: faker.person.fullName(),
};