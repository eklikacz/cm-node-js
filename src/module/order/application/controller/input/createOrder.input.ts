import { ContextRunner, body } from 'express-validator';
import { validate } from 'uuid';

export function createOrderInput (): ContextRunner[] {
  return [
    body('customerId')
      .notEmpty().withMessage('customerId is required')
      .custom((value: string) => validate(value) && value[14] === '7').withMessage('customerId must be a valid UUID v7'),
    body('products')
      .isArray({ min: 1 }).withMessage('Products must be an array with at least one item'),
    body('products.*.id')
      .notEmpty().withMessage('Product id is required')
      .isUUID().withMessage('Product id must be a valid UUID'),
    body('products.*.count')
      .notEmpty().withMessage('Product count is required')
      .isInt({ gt: 0 }).withMessage('Product count must be a positive integer'),
    body('products.*.price')
      .isString().withMessage('price must be a string')
      .isLength({ max: 50 }).withMessage('price must be at most 50 characters long')
      .notEmpty().withMessage('price is required')
      .custom((value) => {
        const priceValue = parseFloat(value);

        return !(isNaN(priceValue) || priceValue <= 0);
      }).withMessage('price must be a positive number')
      .custom((value) => /^\d+(\.\d+)?$/.test(String(value).replace('-', '')))
      .withMessage('price must be a valid number with a dot as a decimal separator'),
  ];
}
