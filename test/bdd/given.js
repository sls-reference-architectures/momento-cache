import { createProduct as createProductInDb } from '../adapters/dynamoDbAdapter';
import { buildProductForDb } from '../testDataGenerators';

const aProductInTheDb = async (overrideWith) => {
  const product = await createProductInDb(buildProductForDb(overrideWith));

  return product;
};

export { aProductInTheDb };
