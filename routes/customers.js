// routes/customers.js
const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// Lấy tất cả khách hàng
router.get('/all', async (req, res) => {
    try {
        const customers = await Customer.find().sort({ createdAt: -1 });
        res.json(customers);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách khách hàng:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách khách hàng' });
    }
});

// Thêm khách hàng mới
router.post('/add', async (req, res) => {
    try {
        const { ten, sdt, email, diaChi } = req.body;

        // Validation
        if (!ten || !sdt || !email || !diaChi) {
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
        }

        const newCustomer = new Customer({
            ten,
            sdt,
            email,
            diaChi
        });

        await newCustomer.save();
        res.status(201).json({ 
            message: 'Thêm khách hàng thành công!', 
            success: true, 
            customer: newCustomer 
        });
    } catch (error) {
        console.error('Lỗi khi thêm khách hàng:', error);
        res.status(500).json({ message: 'Lỗi server khi thêm khách hàng' });
    }
});

// Cập nhật khách hàng
router.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { ten, sdt, email, diaChi } = req.body;

        // Validation
        if (!ten || !sdt || !email || !diaChi) {
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
        }

        const updatedCustomer = await Customer.findByIdAndUpdate(
            id,
            { ten, sdt, email, diaChi },
            { new: true, runValidators: true }
        );

        if (!updatedCustomer) {
            return res.status(404).json({ message: 'Không tìm thấy khách hàng' });
        }

        res.json({ 
            message: 'Cập nhật khách hàng thành công!', 
            success: true, 
            customer: updatedCustomer 
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật khách hàng:', error);
        res.status(500).json({ message: 'Lỗi server khi cập nhật khách hàng' });
    }
});

// Xóa khách hàng
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedCustomer = await Customer.findByIdAndDelete(id);
        if (!deletedCustomer) {
            return res.status(404).json({ message: 'Không tìm thấy khách hàng' });
        }

        res.json({ 
            message: 'Xóa khách hàng thành công!', 
            success: true, 
            customer: deletedCustomer 
        });
    } catch (error) {
        console.error('Lỗi khi xóa khách hàng:', error);
        res.status(500).json({ message: 'Lỗi server khi xóa khách hàng' });
    }
});

module.exports = router;