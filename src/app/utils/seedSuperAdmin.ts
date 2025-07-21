import bcryptjs from 'bcryptjs';
import config from '../config';
import { IAuthProvider, Role } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';

/* eslint-disable no-console */
export const seedSuperAdmin = async () => {
    try {
        const isSuperAdminExists = await User.findOne({
            email: config.SUPER_ADMIN_EMAIL,
            role: Role.SUPER_ADMIN,
        });

        if (isSuperAdminExists) {
            console.log('Super admin already exists');
            return;
        }
        console.log('Trying to create default super admin');

        const authProvider: IAuthProvider = {
            provider: 'credentials',
            providerId: config.SUPER_ADMIN_EMAIL,
        };

        const hashedPassword = await bcryptjs.hash(
            config.SUPER_ADMIN_PASSWORD,
            config.BCRYPT_SALT_ROUND
        );

        await User.create({
            name: 'Super Admin',
            role: Role.SUPER_ADMIN,
            email: config.SUPER_ADMIN_EMAIL,
            password: hashedPassword,
            auths: [authProvider],
            isVerified: true,
        });

        console.log('Supper admin created successfully');
    } catch (error) {
        console.log(error);
    }
};
