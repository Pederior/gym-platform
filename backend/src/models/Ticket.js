const ticketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['open', 'in-progress', 'closed'], 
    default: 'open' 
  },
  adminResponse: String,
}, { timestamps: true });