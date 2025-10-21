import { hash, verify } from 'argon2';

export const hashPassword = (password: string) => {
  return hash(password);
};

export const verifyPassword = (hash: string, password: string) => {
  return verify(hash, password);
};

// import bcrypt from 'bcrypt';

// export const hashPassword = async (password: string) => {
//   const salt = await bcrypt.genSalt(10);
//   return await bcrypt.hash(password, salt);
// };

// export const verifyPassword = async (hash: string, password: string) => {
//   return await bcrypt.compare(password, hash);
// };
