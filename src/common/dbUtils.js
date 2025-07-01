const { TABLE_NAME } = process.env;
const SECONDS_IN_A_DAY = 60 * 60 * 24;

const createPk = ({ teamId, id }) => `team#${teamId}#id#${id}`;

const generateTtl = ({ numberOfDays = 7 } = {}) => {
  const secondsSinceEpoch = Math.round(Date.now() / 1000);
  const expirationTime = secondsSinceEpoch + numberOfDays * SECONDS_IN_A_DAY;

  return expirationTime;
};

const buildUpdateProductCommandInput = (product) => {
  const itemToSave = setModifiedPropertiesForProductUpdate(product);
  const updateInput = {
    TableName: TABLE_NAME,
    Key: {
      'team#id': createPk(product),
    },
    ConditionExpression: 'attribute_exists(#id)',
    UpdateExpression: buildUpdateExpression(itemToSave),
    ExpressionAttributeNames: {
      '#id': 'id',
      ...buildExpressionNames(itemToSave),
    },
    ExpressionAttributeValues: {
      ...buildExpressionValues(itemToSave),
    },
    ReturnValues: 'ALL_NEW',
  };

  return updateInput;
};

const setModifiedPropertiesForProductUpdate = (product) => {
  const returnProduct = { ...product };
  delete returnProduct.created;
  returnProduct.updated = new Date().toISOString();

  return returnProduct;
};

const buildUpdateExpression = (product) => {
  const keylessProduct = removeKeys(product);
  const fileProperties = Object.keys(keylessProduct).filter((prop) => product[prop] !== undefined);

  return `SET ${fileProperties.map((_, index) => `#prop_${index} = :value_${index}`).join(', ')}`;
};

const buildExpressionNames = (product) => {
  const keylessProduct = removeKeys(product);
  const productProperties = Object.keys(keylessProduct).filter(
    (prop) => product[prop] !== undefined,
  );

  return productProperties.reduce(
    (accumulator, k, index) => ({ ...accumulator, [`#prop_${index}`]: k }),
    {},
  );
};

const buildExpressionValues = (product) => {
  const keylessProduct = removeKeys(product);
  const productProperties = Object.keys(keylessProduct).filter(
    (prop) => product[prop] !== undefined,
  );

  return productProperties.reduce(
    (accumulator, k, index) => ({ ...accumulator, [`:value_${index}`]: product[k] }),
    {},
  );
};

const removeKeys = (item) => {
  const itemCopy = { ...item };
  delete itemCopy.id;
  delete itemCopy.teamId;
  delete itemCopy['team#id'];

  return itemCopy;
};

export { buildUpdateProductCommandInput, createPk, generateTtl };
