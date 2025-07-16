import db from '../config/database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const register = async (req, res) => {
   
    const { firstname, lastname, password, email } = req.body;


    const hashedPassword = bcrypt.hashSync(password, 10);

    console.log('Registering user:', { firstname, lastname, email, hashedPassword });

    const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists',success: false });
    }

    // Insert new user into the database
    const insertUser = db.prepare('INSERT INTO users (firstname, lastname, password, email) VALUES (?, ?, ?, ?)');
    try {
        insertUser.run(firstname, lastname, hashedPassword, email);
        return res.status(201).json({ message: 'User registered successfully',success: true });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'Internal server error',success: false });
    }
}



const login = async (req, res) => {
   const {email,password} = req.body;


   const findPassword=db.prepare('SELECT * FROM users WHERE email= ?').get(email);
   
    if (!findPassword) {
          return res.status(404).json({ message: 'User not found',success: false });
     }
     // 
   const decodePassword=bcrypt.compare(password, findPassword.password);


    if (!decodePassword) {
        return res.status(401).json({ message: 'Invalid email or password',success: false });
    }
    // Fetch user details
   const user=db.prepare('SELECT * FROM users WHERE email= ?').get(email);

   console.log('User found:', user);
    if (!user) {
         return res.status(401).json({ message: 'Invalid email or password',success: false });
    }

    const token=jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // console.log('User logged in:', { email });
    return res.status(200).json({ message: 'Login successful', user: { id: user.id, firstname: user.firstname, lastname: user.lastname, email: user.email,token },success: true });
}

export {register,login}