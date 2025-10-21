import { Document, Schema, Model, model } from 'mongoose';

export enum UserType {
  USER = 'User',
  ADMIN = 'Admin'
}

export interface IUser extends Document {
  full_name: string;
  email: string;
  password: string;
  user_type: UserType;
  created_at?: Date;
  updated_at?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    full_name: {
      type: String,
      required: [true, 'Full name is required'],
      minlength: [3, 'Full name must be at least 3 characters long'],
      maxlength: [50, 'Full name cannot exceed 50 characters'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      maxlength: [1024, 'Password cannot exceed 1024 characters']
    },
    user_type: {
      type: String,
      enum: Object.values(UserType),
      default: UserType.USER
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { versionKey: false },
    toObject: { versionKey: false }
  }
);

export const User: Model<IUser> = model<IUser>('User', UserSchema);
