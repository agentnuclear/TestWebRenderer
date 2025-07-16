import jwt from 'jsonwebtoken';


const tokenMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Verify the token (this is a placeholder, implement your own verification logic)
  try {
    // Assuming you have a function to verify the token
    const decoded = jwt.verify(token,process.env.JWT_SECRET) 
    req.user = decoded; // Attach user info to request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

export default tokenMiddleware;