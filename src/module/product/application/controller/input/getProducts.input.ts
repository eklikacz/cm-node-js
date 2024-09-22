import { ContextRunner, query } from 'express-validator';

export function getProductsInput (): ContextRunner[] {
  return [
    query('page')
      .optional()
      .isInt({ min: 1, max: Number.MAX_SAFE_INTEGER }).withMessage('page must be a positive integer')
      .toInt(),
    query('itemsPerPage')
      .optional()
      .isInt({ min: 1, max: 200 }).withMessage('itemsPerPage must be a positive integer')
      .toInt(),
    query('sortBy')
      .optional()
      .isString().withMessage('sortBy must be a string')
      .trim()
      .isIn(['createdAt', 'name'])
      .withMessage('sortBy must be one of: createdAt, name'),
    query('sortDir')
      .optional()
      .isString().withMessage('sortDir must be a string')
      .trim()
      .isIn(['asc', 'desc'])
      .withMessage('sortDir must be either asc or desc'),
    query('name')
      .optional()
      .isLength({ min: 1, max: 50 }).withMessage('name must be a positive integer')
      .isString().withMessage('name must be a string')
      .trim(),
  ];
}
