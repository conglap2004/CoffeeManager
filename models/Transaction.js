const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['income', 'expense'], required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  description: String,
  date: { type: String, required: true }, // YYYY-MM-DD
  createdAt: { type: Date, default: Date.now }
});

// Sử dụng model.exits() để kiểm tra và tránh overwrite
module.exports = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);