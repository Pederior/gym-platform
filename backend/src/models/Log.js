const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    enum: [
      'login', 'logout', 'register',
      'create_user', 'update_user', 'delete_user',
      'create_subscription', 'update_subscription', 'cancel_subscription',
      'create_workout', 'complete_workout', 'update_workout_progress',
      'create_diet_plan', 'complete_diet_plan',
      'create_ticket', 'reply_ticket', 'close_ticket',
      'create_class', 'reserve_class', 'cancel_reservation',
      'upload_video', 'view_video',
      'update_settings', 'payment_success', 'payment_failed'
    ],
    required: true
  },
  description: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed },
  ip: { type: String },
  userAgent: { type: String },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: false });

module.exports = mongoose.model('Log', LogSchema);