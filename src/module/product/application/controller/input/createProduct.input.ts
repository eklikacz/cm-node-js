import { ContextRunner, body } from 'express-validator';

export function createProductInput (): ContextRunner[] {
  return [
    body('name')
      .isString().withMessage('name must be a string')
      .isLength({ max: 50 }).withMessage('name must be at most 50 characters long')
      .notEmpty().withMessage('name is required'),
    body('description')
      .isString().withMessage('description must be a string')
      .isLength({ max: 50 }).withMessage('description must be at most 50 characters long')
      .notEmpty().withMessage('description is required'),
    body('price')
      .isString().withMessage('price must be a string')
      .isLength({ max: 50 }).withMessage('price must be at most 50 characters long')
      .notEmpty().withMessage('price is required')
      .custom((value) => {
        const priceValue = parseFloat(value);

        return !(isNaN(priceValue) || priceValue <= 0);
      }).withMessage('price must be a positive number')
      .custom((value) => /^\d+(\.\d+)?$/.test(String(value).replace('-', '')))
      .withMessage('price must be a valid number with a dot as a decimal separator'),
    body('stock')
      .isInt({ min: 0 }).withMessage('stock must be a non-negative integer')
      .notEmpty().withMessage('stock is required'),
  ];
}
