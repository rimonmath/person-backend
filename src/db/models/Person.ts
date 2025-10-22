import { Document, Schema, Model, model } from 'mongoose';

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other'
}

export interface IPerson extends Document {
  first_name: string;
  last_name: string;
  email: string;
  image?: string;
  gender: Gender;
  address: string;
  created_at?: Date;
  updated_at?: Date;
}

const personSchema = new Schema<IPerson>(
  {
    first_name: {
      type: String,
      required: [true, 'First name is required'],
      minlength: [2, 'First name must be at least 2 characters'],
      maxlength: [50, 'First name cannot exceed 50 characters'],
      trim: true
    },
    last_name: {
      type: String,
      required: [true, 'Last name is required'],
      minlength: [2, 'Last name must be at least 2 characters'],
      maxlength: [50, 'Last name cannot exceed 50 characters'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    image: {
      type: String
    },
    gender: {
      type: String,
      enum: Object.values(Gender),
      required: [true, 'Gender is required']
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      maxlength: [500, 'Address cannot exceed 500 characters']
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { versionKey: false },
    toObject: { versionKey: false }
  }
);

// Model
export const Person: Model<IPerson> = model<IPerson>('Person', personSchema);
