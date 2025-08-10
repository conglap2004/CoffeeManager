const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

router.post('/add', async (req, res) => {
    try {
        const newTransaction = new Transaction(req.body);
        await newTransaction.save();
        res.status(200).json({ success: true, message: 'Lưu giao dịch thành công!' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi khi lưu giao dịch', error: err });
    }
});

router.get('/all', async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ createdAt: -1 });
        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi lấy giao dịch', error: err });
    }
});

module.exports = router;