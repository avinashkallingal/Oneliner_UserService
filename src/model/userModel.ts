import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from '../domain/entities/IUser';

export interface IUserDocument extends IUser, Document { }

const userSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
  },
  email: {
    type: String,
    required: true,
    maxlength: 50,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  gender: {
    type: String,
    default: 'Not added',
   
  },  
  language: {
    type: String,
    default: 'Not added',
        
  },
  about: {
    type: String,
    default: 'Not added',
    
  },
  profilePicture: {
    type: String,
    default: '',
  },
  followers: {
    type: [String],
    default: [],
  },
  followings: {
    type: [String],
    default: [],
  },
  savedPost: {
    type: [String],
    default: [],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  desc: {
    type: String,
    maxlength: 50,
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export const User = mongoose.model<IUserDocument>('User', userSchema);
