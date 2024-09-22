import { Document, Schema } from 'mongoose';

export interface IProductSchema extends Document {
  id: string,
  name: string,
  description: string,
  price: string,
  stock: number,
  createdAt: Date,
  updatedAt?: Date,
  deletedAt?: Date,
}

export const ProductSchema: Schema = new Schema<IProductSchema>({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, index: true },
  description: { type: String, required: true },
  price: {
    type: String,
    required: true,
    match: [/^\d+(\.\d+)?$/, 'Invalid price format'],
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Stock must be non-negative'],
    validate: { validator: Number.isInteger, message: 'Product stock count must be an integer' },
  },
  createdAt: { type: Date, required: true, default: Date.now, index: true },
  updatedAt: { type: Date },
  deletedAt: { type: Date },
});
