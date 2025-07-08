import { IUser } from './user.interface';
import { User } from './user.model';

const createUser = async (payload: Partial<IUser>) => {
  const { name, email } = payload;

  const newUser = await User.create({ name, email });

  return newUser;
};

export const UserServices = { createUser };
