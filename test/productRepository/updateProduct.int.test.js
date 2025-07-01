import { faker } from '@faker-js/faker';
import { ProductStatus } from '../../src/common/constants';
import { updateProduct } from '../../src/common/productRepository';
import * as Given from '../bdd/given';
import * as Then from '../bdd/then';

describe('When updating a product', () => {
  it('should save the new status in the database', async () => {
    // ARRANGE
    const product = await Given.aProductInTheDb({ status: ProductStatus.PENDING });
    const status = ProductStatus.SUCCESS;

    // ACT
    await updateProduct({ id: product.id, teamId: product.teamId, status });

    // ASSERT
    await Then.assertProductUpdatedInDatabase({ status, teamId: product.teamId, id: product.id });
  });

  it('should save a note if provided', async () => {
    // ARRANGE
    const product = await Given.aProductInTheDb({ status: ProductStatus.PENDING });
    const status = ProductStatus.SUCCESS;
    const note = faker.lorem.sentence();

    // ACT
    await updateProduct({ id: product.id, teamId: product.teamId, status, note });

    // ASSERT
    await Then.assertProductUpdatedInDatabase({
      status,
      teamId: product.teamId,
      id: product.id,
      note,
    });
  });

  describe('that does not exist', () => {
    it('should throw 404 (Not Found)', async () => {
      // ARRANGE
      const teamId = faker.string.uuid();
      const id = faker.string.uuid();

      // ACT
      const updateAction = async () =>
        await updateProduct({ id, teamId, status: ProductStatus.SUCCESS });

      // ASSERT
      await expect(updateAction).rejects.toThrow(/not found/i);
    });
  });
});
