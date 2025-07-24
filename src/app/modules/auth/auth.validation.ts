import z from 'zod';

export const resetPasswordZodSchema = z.object({
    oldPassword: z
        .string({ invalid_type_error: 'Old Password must be string type' })
        .min(8, { message: 'Old Password must be at least 8 characters long' })
        .max(100, { message: 'Old Password can be maximum 100 characters' }),
    newPassword: z
        .string({ invalid_type_error: 'New Password must be string type' })
        .min(8, { message: 'New Password must be at least 8 characters long' })
        .regex(/(?=.*[A-Z])/, {
            message: 'New Password must contain at least one uppercase letter',
        })
        .regex(/(?=.*[a-z])/, {
            message: 'New Password must contain at least one lowercase letter',
        })
        .regex(/(?=.*\d)/, {
            message: 'New Password must contain at least one number',
        })
        // eslint-disable-next-line no-useless-escape
        .regex(/(?=.*[!@#$%^&*(),.?":{}|<>_\-+=\\\/\[\];'`~])/, {
            message: 'New Password must contain at least one special character',
        }),
});
