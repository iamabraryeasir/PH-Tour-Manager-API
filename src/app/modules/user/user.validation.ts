import z from 'zod';
import { IsActive, Role } from './user.interface';

export const createUserZodSchema = z.object({
  name: z
    .string({ invalid_type_error: 'Name must be string type' })
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(50, { message: 'Name can be maximum 50 characters' }),
  email: z
    .string({ invalid_type_error: 'Email must be string type' })
    .email({ message: 'Email must be in proper email format' }),
  password: z
    .string({ invalid_type_error: 'Phone number must be string type' })
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/(?=.*[A-Z])/, {
      message: 'Password must contain at least one uppercase letter',
    })
    .regex(/(?=.*[a-z])/, {
      message: 'Password must contain at least one lowercase letter',
    })
    .regex(/(?=.*\d)/, {
      message: 'Password must contain at least one number',
    })
    // eslint-disable-next-line no-useless-escape
    .regex(/(?=.*[!@#$%^&*(),.?":{}|<>_\-+=\\\/\[\];'`~])/, {
      message: 'Password must contain at least one special character',
    }),
  phone: z
    .string({
      invalid_type_error: 'Phone number must be a string',
    })
    .regex(/^\+8801[3-9]\d{8}$/, {
      message:
        'Phone number must start with +880 and be a valid Bangladeshi number (e.g. +88017XXXXXXXX)',
    })
    .optional(),
  address: z
    .string({
      invalid_type_error: 'Address must be a string',
    })
    .max(200, { message: 'Address must be in between 200 characters' })
    .optional(),
});

export const updateUserZodSchema = z.object({
  name: z
    .string({ invalid_type_error: 'Name must be string type' })
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(50, { message: 'Name can be maximum 50 characters' })
    .optional(),
  password: z
    .string({ invalid_type_error: 'Password must be string type' })
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/(?=.*[A-Z])/, {
      message: 'Password must contain at least one uppercase letter',
    })
    .regex(/(?=.*[a-z])/, {
      message: 'Password must contain at least one lowercase letter',
    })
    .regex(/(?=.*\d)/, {
      message: 'Password must contain at least one number',
    })
    // eslint-disable-next-line no-useless-escape
    .regex(/(?=.*[!@#$%^&*(),.?":{}|<>_\-+=\\\/\[\];'`~])/, {
      message: 'Password must contain at least one special character',
    })
    .optional(),
  phone: z
    .string({
      invalid_type_error: 'Phone number must be a string',
    })
    .regex(/^\+8801[3-9]\d{8}$/, {
      message:
        'Phone number must start with +880 and be a valid Bangladeshi number (e.g. +88017XXXXXXXX)',
    })
    .optional(),
  address: z
    .string({
      invalid_type_error: 'Address must be a string',
    })
    .max(200, { message: 'Address must be in between 200 characters' })
    .optional(),
  role: z.enum(Object.keys(Role) as [string]).optional(),
  isActive: z.enum(Object.values(IsActive) as [string]).optional(),
  isDeleted: z
    .boolean({
      invalid_type_error: 'isDeleted must be true or false',
    })
    .optional(),
  isVerified: z
    .boolean({
      invalid_type_error: 'isDeleted must be true or false',
    })
    .optional(),
});
