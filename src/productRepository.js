import { GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { NotFound } from 'http-errors';

import getDynamoDbClient from './common/documentClient';
import { ProductStatus } from './common/constants';
import { buildUpdateProductCommandInput } from './common/dbUtils';

const { TABLE_NAME } = process.env;
const SECONDS_IN_A_DAY = 60 * 60 * 24;

const getProductById = async ({ teamId, id }) => {
  const params = {
    TableName: TABLE_NAME,
    Key: { 'team#id': createPk({ teamId, id }) },
  };
  const client = getDynamoDbClient();
  const { Item } = await client.send(new GetCommand(params));
  if (!Item) {
    throw new NotFound(`Product not found: ${id}`);
  }

  return Item;
};

const saveProduct = async (product) => {
  const productToSave = setNewProductDefaults(product);
  const params = {
    TableName: TABLE_NAME,
    Item: {
      ...productToSave,
      status: ProductStatus.PENDING,
      'team#id': createPk(product),
      ttl: generateTtl(),
    },
  };
  const client = getDynamoDbClient();
  await client.send(new PutCommand(params));

  return productToSave;
};

const updateProduct = async ({ id, teamId, ...rest }) => {
  const updateInput = buildUpdateProductCommandInput({ teamId, id, ...rest });
  const client = getDynamoDbClient();
  try {
    const result = await client.send(new UpdateCommand(updateInput));

    return result.Attributes;
  } catch (err) {
    if (err.name !== 'ConditionalCheckFailedException') {
      throw err;
    }
    throw new NotFound(`Not Found: Product with id: ${id}`);
  }
};

const createPk = ({ teamId, id }) => `team#${teamId}#id#${id}`;

const generateTtl = ({ numberOfDays = 7 } = {}) => {
  const secondsSinceEpoch = Math.round(Date.now() / 1000);
  const expirationTime = secondsSinceEpoch + numberOfDays * SECONDS_IN_A_DAY;

  return expirationTime;
};

const setNewProductDefaults = (product) => {
  const now = new Date().toISOString();

  return {
    ...product,
    created: now,
    updated: now,
  };
};

export { createPk, generateTtl, getProductById, saveProduct, updateProduct };
