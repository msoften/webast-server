// TODO: Module docs
// Business Logic layer, contains auth related function.

import UserModel from './model';
import * as UsersRepository from './repository';


// TODO: Add function docs.
export const createUser = async (user: UserModel): Promise<UserModel> => {
	// TODO: Validate email.
	// TODO: Validate password; strength.
  
	// Check if user exists.
	const existingUser = await UsersRepository.getUserByEmail(user.email);

	if (existingUser)
		throw new Error('User exists, login instead.');

	// Create user.
	const newUser = await UsersRepository.createUser(user);

	return newUser;
};
