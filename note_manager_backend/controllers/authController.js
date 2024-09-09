const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// get SECRET_KEY from .env
const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
  throw new Error('SECRET_KEY is not defined in the environment variables');
}

//mock data in-memory
let users = [
  { id: 1, firstName: 'Le', lastName: 'Van Dung', phone: '012345678', password: bcrypt.hashSync('password123', 10) }
];

let refreshTokens = [];

//signin
const signIn = (req, res) => {
  const { firstName, lastName, phone, password, confirmPassword } = req.body;

  if (!password || !confirmPassword) {
    return res.status(400).json({ message: 'Password is required' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  console.log('data: ', {firstName, lastName, phone, password, confirmPassword})
  const userExists = users.find(user => user.phone === phone);
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = { id: users.length + 1, firstName, lastName, phone, password: hashedPassword };
    users.push(newUser);

    res.json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//login
const login = (req, res) => {
  const { phone, password } = req.body;

  const user = users.find(u => u.phone === phone);
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  const validPassword = bcrypt.compareSync(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ message: 'Invalid password' });
  }

  const accessToken = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '7d' });

  refreshTokens.push(refreshToken);
  res.json({ accessToken, refreshToken });
};


//get user infor
const getUserInformation = (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json({ firstName: user.firstName, lastName: user.lastName, phone: user.phone });
};


//sign out
const signOut = (req, res) => {
  const { token } = req.body;

  refreshTokens = refreshTokens.filter(rt => rt !== token);
  res.json({ message: 'Logged out successfully' });
};


//refresh token
const refreshToken = (req, res) => {
  const { token } = req.body;

  if (!token) return res.sendStatus(401);
  if (!refreshTokens.includes(token)) return res.sendStatus(403);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);

    const accessToken = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ accessToken });
  });
};

//export function
module.exports = { signIn, login, getUserInformation, signOut, refreshToken };
