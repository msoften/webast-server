// TODO: Module docs
// Business Logic layer, contains auth related function.

import * as UsersRepository from '../users/repository';


// TODO: Add function docs.
export const getUserToken = async (email: string, password: string): Promise<string> => {
	// TODO: Validate email.
	// TODO: Validate password; strength.
  
	// Check if user exists.
	const user = await UsersRepository.getUserByEmail(email);

	if (!user)
		throw new Error('User does not exist, register.');

	if (!user || user.password !== password)
		throw new Error('Invalid credetials, try again.');

	return user.token;
};
