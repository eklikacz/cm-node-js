import { Document, Schema } from 'mongoose';
import { IOrderItem, itemSchema } from '@order/domain/schema/orderItem.schema';

export interface IOrderSchema extends Document {
  id: string,
  customerId: string,
  orderedCount: number,
  items: IOrderItem[],
  createdAt: Date,
  updatedAt?: Date,
  deletedAt?: Date,
}

export const OrderSchema: Schema = new Schema<IOrderSchema>({
  id: { type: String, required: true, unique: true, index: true },
  customerId: { type: String, required: true, index: true },
  orderedCount: {
    type: Number,
    required: true,
    default: 0,
    min: [1, 'Order count must be at least 1'],
    validate: { validator: Number.isInteger, message: 'Order count must be an integer' },
  },
  items: {
    type: [itemSchema],
    validate: {
      validator: function (v: IOrderItem[]) {
        return v && v.length > 0;
      },
      message: 'At least one item is required',
    },
  },
  createdAt: { type: Date, required: true, default: Date.now, index: true },
  updatedAt: { type: Date },
  deletedAt: { type: Date },
});
