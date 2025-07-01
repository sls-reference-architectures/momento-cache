import { PutCommand } from '@aws-sdk/lib-dynamodb';
import getDynamoDbClient from '../../src/common/documentClient';

const { TABLE_NAME } = process.env;

const createProduct = async (product) => {
  const params = {
    TableName: TABLE_NAME,
    Item: product,
  };
  const client = getDynamoDbClient();
  await client.send(new PutCommand(params));

  return product;
};

export { createProduct };
