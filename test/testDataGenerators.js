import { faker } from '@faker-js/faker';
import { ulid } from 'ulid';
import { createPk } from '../src/productRepository';

const buildProductForDb = (overrideWith = {}) => {
  const id = overrideWith.id || buildTestId();
  const teamId = overrideWith.teamId || buildTestId();
  const pk = createPk({ teamId, id });
  const now = new Date().toISOString();
  const ticket = {
    created: now,
    description: faker.lorem.sentence(),
    id,
    'team#id': pk,
    teamId,
    name: faker.lorem.words(3),
    price: faker.number.int({ min: 1, max: 1000 }),
    updated: now,
    ...overrideWith,
  };

  return ticket;
};

const buildTestId = () => `TEST_${ulid()}`;

export { buildProductForDb, buildTestId };
