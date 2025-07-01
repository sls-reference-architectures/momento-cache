import * as Given from '../bdd/given';
import { buildTestId } from '../testDataGenerators';
import { getProductById } from '../../src/productRepository';

describe('When getting a product', () => {
  describe('that exists', () => {
    it('should return the product', async () => {
      // ARRANGE
      const product = await Given.aProductInTheDb();

      // ACT
      const result = await getProductById({ teamId: product.teamId, id: product.id });

      // ASSERT
      expect(result.id).toEqual(product.id);
      expect(result.teamId).toEqual(product.teamId);
    });
  });

  describe('that does not exist', () => {
    it('should throw 404 (Not Found)', async () => {
      // ARRANGE
      const teamId = buildTestId();
      const id = buildTestId();

      // ACT
      const act = async () => getProductById({ teamId, id });

      // ASSERT
      await expect(act()).rejects.toThrow(/Not Found/i);
    });
  });
});
