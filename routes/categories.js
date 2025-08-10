const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// Lấy tất cả danh mục
router.get('/all', async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            data: categories,
            count: categories.length
        });
    } catch (error) {
        console.error('Lỗi lấy danh mục:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy danh mục'
        });
    }
});

// Lấy danh mục theo ID
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy danh mục'
            });
        }
        res.json({
            success: true,
            data: category
        });
    } catch (error) {
        console.error('Lỗi lấy danh mục:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy danh mục'
        });
    }
});

// Thêm danh mục mới
router.post('/add', async (req, res) => {
    try {
        const { maDanhMuc, tenDanhMuc } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!maDanhMuc || !tenDanhMuc) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập đầy đủ mã danh mục và tên danh mục'
            });
        }

        // Kiểm tra mã danh mục đã tồn tại
        const existingCategory = await Category.findOne({ maDanhMuc });
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: 'Mã danh mục đã tồn tại'
            });
        }

        // Tạo danh mục mới
        const newCategory = new Category({
            maDanhMuc: maDanhMuc.trim(),
            tenDanhMuc: tenDanhMuc.trim()
        });

        await newCategory.save();

        res.status(201).json({
            success: true,
            message: 'Thêm danh mục thành công',
            data: newCategory
        });
    } catch (error) {
        console.error('Lỗi thêm danh mục:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi thêm danh mục'
        });
    }
});

// Cập nhật danh mục
router.put('/update/:id', async (req, res) => {
    try {
        const { maDanhMuc, tenDanhMuc } = req.body;
        const categoryId = req.params.id;

        // Kiểm tra dữ liệu đầu vào
        if (!maDanhMuc || !tenDanhMuc) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập đầy đủ mã danh mục và tên danh mục'
            });
        }

        // Kiểm tra danh mục tồn tại
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy danh mục để cập nhật'
            });
        }

        // Kiểm tra mã danh mục đã tồn tại (trừ danh mục hiện tại)
        const existingCategory = await Category.findOne({ 
            maDanhMuc: maDanhMuc.trim(),
            _id: { $ne: categoryId }
        });
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: 'Mã danh mục đã tồn tại'
            });
        }

        // Cập nhật danh mục
        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            {
                maDanhMuc: maDanhMuc.trim(),
                tenDanhMuc: tenDanhMuc.trim(),
                updatedAt: Date.now()
            },
            { new: true }
        );

        res.json({
            success: true,
            message: 'Cập nhật danh mục thành công',
            data: updatedCategory
        });
    } catch (error) {
        console.error('Lỗi cập nhật danh mục:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi cập nhật danh mục'
        });
    }
});

// Xóa danh mục
router.delete('/delete/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;

        const deletedCategory = await Category.findByIdAndDelete(categoryId);
        if (!deletedCategory) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy danh mục để xóa'
            });
        }

        res.json({
            success: true,
            message: 'Xóa danh mục thành công',
            data: deletedCategory
        });
    } catch (error) {
        console.error('Lỗi xóa danh mục:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi xóa danh mục'
        });
    }
});

// Tìm kiếm danh mục
router.get('/search/:keyword', async (req, res) => {
    try {
        const keyword = req.params.keyword;
        const categories = await Category.find({
            $or: [
                { maDanhMuc: { $regex: keyword, $options: 'i' } },
                { tenDanhMuc: { $regex: keyword, $options: 'i' } }
            ]
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            data: categories,
            count: categories.length
        });
    } catch (error) {
        console.error('Lỗi tìm kiếm danh mục:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi tìm kiếm danh mục'
        });
    }
});

module.exports = router;