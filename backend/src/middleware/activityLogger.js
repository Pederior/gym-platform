const Log = require('../models/Log');

const logActivity = async (userId, action, description = '', metadata = {}) => {
  try {
    const log = new Log({
      user: userId,
      action,
      description,
      metadata,
      ip: this?.req?.ip || 'unknown',
      userAgent: this?.req?.headers?.['user-agent'] || 'unknown'
    });
    await log.save();
  } catch (err) {
    console.error('Failed to log activity:', err);
  }
};

const createActivityLogger = (action, descriptionFn = null, metadataFn = null) => {
  return async (req, res, next) => {
    try {
      await next();
      
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const description = descriptionFn ? descriptionFn(req, res) : '';
        const metadata = metadataFn ? metadataFn(req, res) : {};
        
        await logActivity(
          req.user?._id || (req.body?.user || req.body?.userId),
          action,
          description,
          metadata
        );
      }
    } catch (err) {
      next(err);
    }
  };
};

module.exports = { logActivity, createActivityLogger };