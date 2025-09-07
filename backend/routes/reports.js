import express from 'express';
import Report from '../models/Report.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    if (!process.env.MONGO_URI) {
      return res.json({ 
        success: false,
        message: 'Database not configured',
        reports: [] 
      });
    }

    const { page = 1, limit = 10, codeType } = req.query;
    const userId = req.user.uid;

    const query = { userId };
    if (codeType && ['javascript', 'css'].includes(codeType)) {
      query.codeType = codeType;
    }

    const reports = await Report.find(query)
      .select('-codeContent') // Exclude large code content from list
      .sort({ createdAt: -1 })
      .limit(Math.min(parseInt(limit), 50))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean();

    const total = await Report.countDocuments(query);

    res.json({
      success: true,
      reports,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Reports fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch reports',
      message: error.message 
    });
  }
});

router.get('/:reportId', async (req, res) => {
  try {
    if (!process.env.MONGO_URI) {
      return res.status(404).json({ error: 'Database not configured' });
    }

    const { reportId } = req.params;
    const userId = req.user.uid;

    const report = await Report.findOne({ 
      _id: reportId, 
      userId 
    }).lean();

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json({
      success: true,
      report
    });

  } catch (error) {
    console.error('Report fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch report',
      message: error.message 
    });
  }
});

router.delete('/:reportId', async (req, res) => {
  try {
    if (!process.env.MONGO_URI) {
      return res.status(404).json({ error: 'Database not configured' });
    }

    const { reportId } = req.params;
    const userId = req.user.uid;

    const result = await Report.deleteOne({ 
      _id: reportId, 
      userId 
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json({
      success: true,
      message: 'Report deleted successfully'
    });

  } catch (error) {
    console.error('Report delete error:', error);
    res.status(500).json({ 
      error: 'Failed to delete report',
      message: error.message 
    });
  }
});

export default router;