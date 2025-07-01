import { saveProduct } from '../../src/common/productRepository';
import * as Then from '../bdd/then';
import { buildTestId } from '../common/dataGenerators';

describe('When saving a product', () => {
  describe('with valid data', () => {
    it('should store the product in database', async () => {
      // ARRANGE
      const teamId = buildTestId();
      const id = buildTestId();
      const product = {
        id,
        teamId,
      };

      // ACT
      await saveProduct(product);

      // ASSERT
      await Then.assertProductSavedInDatabase({ teamId, id });
    });
  });
});
