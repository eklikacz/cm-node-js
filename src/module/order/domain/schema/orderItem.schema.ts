import { Document, Schema } from 'mongoose';

export interface IOrderItem extends Document {
  id: string,
  orderedCount: number,
  price: string,
}

export const itemSchema = new Schema<IOrderItem>({
  id: { type: String, required: true, index: true },
  orderedCount: {
    type: Number,
    required: true,
    min: [1, 'Order count must be at least 1'],
    validate: {
      validator: function (value: number) {
        return value > 0;
      },
      message: 'Order count must be an integer',
    },
  },
  price: {
    type: String,
    required: true,
    match: [/^\d+(\.\d+)?$/, 'Invalid price format'],
  },
});
