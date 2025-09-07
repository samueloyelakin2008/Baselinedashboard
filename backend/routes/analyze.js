import express from 'express';
import Report from '../models/Report.js';
import featureScanner from '../lib/featureScanner.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { code, codeType } = req.body;
    
    if (!code || !codeType) {
      return res.status(400).json({ error: 'Code and codeType are required' });
    }

    if (!['javascript', 'css'].includes(codeType)) {
      return res.status(400).json({ error: 'codeType must be either "javascript" or "css"' });
    }

    if (code.length > 50000) {
      return res.status(400).json({ error: 'Code size exceeds maximum limit (50KB)' });
    }

    // Analyze the code
    const analysis = featureScanner.analyzeCode(code, codeType);
    
    // Save report to MongoDB if available
    if (process.env.MONGO_URI && req.user) {
      try {
        const report = new Report({
          userId: req.user.uid,
          userEmail: req.user.email || 'unknown@example.com',
          codeType,
          codeContent: code,
          features: analysis.features,
          summary: analysis.summary
        });
        
        await report.save();
        console.log(`📊 Report saved for user: ${req.user.email}`);
      } catch (dbError) {
        console.error('Database save error:', dbError);
        // Continue with response even if DB save fails
      }
    }

    res.json({
      success: true,
      analysis,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ 
      error: 'Analysis failed',
      message: error.message 
    });
  }
});

export default router;