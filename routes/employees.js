// routes/employees.js
const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// Lấy tất cả nhân viên
router.get('/all', async (req, res) => {
    try {
        const employees = await Employee.find().sort({ createdAt: -1 });
        res.json(employees);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách nhân viên:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách nhân viên' });
    }
});

// Thêm nhân viên mới
router.post('/add', async (req, res) => {
    try {
        const { hoTen, email, soDienThoai, chucVu } = req.body;

        // Validation
        if (!hoTen || !email || !soDienThoai || !chucVu) {
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
        }

        // Kiểm tra email đã tồn tại
        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            return res.status(400).json({ message: 'Email đã được sử dụng' });
        }

        const newEmployee = new Employee({
            hoTen,
            email,
            soDienThoai,
            chucVu
        });

        await newEmployee.save();
        res.status(201).json({ 
            message: 'Thêm nhân viên thành công!', 
            success: true, 
            employee: newEmployee 
        });
    } catch (error) {
        console.error('Lỗi khi thêm nhân viên:', error);
        if (error.code === 11000) {
            res.status(400).json({ message: 'Email đã được sử dụng' });
        } else {
            res.status(500).json({ message: 'Lỗi server khi thêm nhân viên' });
        }
    }
});

// Cập nhật nhân viên
router.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { hoTen, email, soDienThoai, chucVu } = req.body;

        // Validation
        if (!hoTen || !email || !soDienThoai || !chucVu) {
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
        }

        // Kiểm tra email đã tồn tại (trừ nhân viên hiện tại)
        const existingEmployee = await Employee.findOne({ 
            email, 
            _id: { $ne: id } 
        });
        if (existingEmployee) {
            return res.status(400).json({ message: 'Email đã được sử dụng' });
        }

        const updatedEmployee = await Employee.findByIdAndUpdate(
            id,
            { hoTen, email, soDienThoai, chucVu },
            { new: true, runValidators: true }
        );

        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
        }

        res.json({ 
            message: 'Cập nhật nhân viên thành công!', 
            success: true, 
            employee: updatedEmployee 
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật nhân viên:', error);
        res.status(500).json({ message: 'Lỗi server khi cập nhật nhân viên' });
    }
});

// Xóa nhân viên
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedEmployee = await Employee.findByIdAndDelete(id);
        if (!deletedEmployee) {
            return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
        }

        res.json({ 
            message: 'Xóa nhân viên thành công!', 
            success: true, 
            employee: deletedEmployee 
        });
    } catch (error) {
        console.error('Lỗi khi xóa nhân viên:', error);
        res.status(500).json({ message: 'Lỗi server khi xóa nhân viên' });
    }
});

module.exports = router;