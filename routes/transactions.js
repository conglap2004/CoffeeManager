const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// Thêm giao dịch mới
router.post('/add', async (req, res) => {
    try {
        const newTransaction = new Transaction(req.body);
        const savedTransaction = await newTransaction.save();
        res.status(201).json({
            success: true,
            message: 'Lưu giao dịch thành công!',
            data: savedTransaction
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lưu giao dịch',
            error: err.message
        });
    }
});

// Lấy tất cả giao dịch
router.get('/all', async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: transactions
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy giao dịch',
            error: err.message
        });
    }
});

module.exports = router;
