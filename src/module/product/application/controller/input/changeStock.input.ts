import { ContextRunner, body, param } from 'express-validator';
import { validate } from 'uuid';

export function changeStockInput (): ContextRunner[] {
  return [
    param('id').custom((value: string) => validate(value) && value[14] === '7').withMessage('Invalid UUID v7'),
    body('count')
      .isNumeric().withMessage('Count must be a number')
      .isInt({ min: 1, max: Number.MAX_SAFE_INTEGER }).withMessage('count must be a positive integer'),
  ];
}
