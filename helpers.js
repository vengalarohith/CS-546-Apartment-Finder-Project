import bcrypt from 'bcrypt';

const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

const comparePasswords = async (plainPassword, hashedPassword) => {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  console.log(isMatch)
  return isMatch;
};

export { hashPassword, comparePasswords };
