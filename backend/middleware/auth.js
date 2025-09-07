import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
      : null;

    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('✅ Firebase Admin SDK initialized');
    } else {
      console.log('⚠️ Firebase Admin SDK not initialized - FIREBASE_SERVICE_ACCOUNT not provided');
    }
  } catch (error) {
    console.error('❌ Firebase Admin SDK initialization error:', error);
  }
}

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No valid authorization header provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    
    if (!admin.apps.length) {
      // If Firebase Admin is not initialized, skip auth for development
      console.log('⚠️ Skipping auth verification - Firebase Admin not initialized');
      req.user = { uid: 'dev-user', email: 'dev@example.com' };
      return next();
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export default authMiddleware;