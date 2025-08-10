const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Lấy tất cả sản phẩm
router.get('/all', async (req, res) => {
    try {
        const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
        res.json({
            success: true,
            data: products,
            message: 'Lấy danh sách sản phẩm thành công'
        });
    } catch (error) {
        console.error('Lỗi lấy danh sách sản phẩm:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy danh sách sản phẩm'
        });
    }
});

// Lấy sản phẩm theo ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product || !product.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });
        }
        res.json({
            success: true,
            data: product,
            message: 'Lấy thông tin sản phẩm thành công'
        });
    } catch (error) {
        console.error('Lỗi lấy thông tin sản phẩm:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy thông tin sản phẩm'
        });
    }
});

// Thêm sản phẩm mới
router.post('/create', async (req, res) => {
    try {
        const { name, price, category, image, description } = req.body;

        // Validate dữ liệu
        if (!name || !price || !category) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu thông tin bắt buộc (tên, giá, danh mục)'
            });
        }

        if (price < 1000) {
            return res.status(400).json({
                success: false,
                message: 'Giá phải từ 1,000 VNĐ trở lên'
            });
        }

        // Kiểm tra sản phẩm trùng tên
        const existingProduct = await Product.findOne({ 
            name: name.trim(), 
            isActive: true 
        });
        if (existingProduct) {
            return res.status(400).json({
                success: false,
                message: 'Sản phẩm với tên này đã tồn tại'
            });
        }

        const newProduct = new Product({
            name: name.trim(),
            price: parseInt(price),
            category,
            image: image || 'https://via.placeholder.com/300x200?text=No+Image',
            description: description || ''
        });

        const savedProduct = await newProduct.save();
        res.status(201).json({
            success: true,
            data: savedProduct,
            message: 'Thêm sản phẩm thành công!'
        });
    } catch (error) {
        console.error('Lỗi thêm sản phẩm:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi thêm sản phẩm'
        });
    }
});

// Cập nhật sản phẩm
router.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, category, image, description } = req.body;

        // Validate dữ liệu
        if (!name || !price || !category) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu thông tin bắt buộc (tên, giá, danh mục)'
            });
        }

        if (price < 1000) {
            return res.status(400).json({
                success: false,
                message: 'Giá phải từ 1,000 VNĐ trở lên'
            });
        }

        // Kiểm tra sản phẩm tồn tại
        const product = await Product.findById(id);
        if (!product || !product.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });
        }

        // Kiểm tra trùng tên (trừ chính nó)
        const existingProduct = await Product.findOne({ 
            name: name.trim(), 
            isActive: true,
            _id: { $ne: id }
        });
        if (existingProduct) {
            return res.status(400).json({
                success: false,
                message: 'Sản phẩm với tên này đã tồn tại'
            });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                name: name.trim(),
                price: parseInt(price),
                category,
                image: image || product.image,
                description: description || '',
                updatedAt: new Date()
            },
            { new: true }
        );

        res.json({
            success: true,
            data: updatedProduct,
            message: 'Cập nhật sản phẩm thành công!'
        });
    } catch (error) {
        console.error('Lỗi cập nhật sản phẩm:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi cập nhật sản phẩm'
        });
    }
});

// Xóa sản phẩm (soft delete)
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);
        if (!product || !product.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });
        }

        // Soft delete - chỉ đánh dấu isActive = false
        await Product.findByIdAndUpdate(id, { 
            isActive: false, 
            updatedAt: new Date() 
        });

        res.json({
            success: true,
            message: 'Xóa sản phẩm thành công!',
            data: { id, name: product.name }
        });
    } catch (error) {
        console.error('Lỗi xóa sản phẩm:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi xóa sản phẩm'
        });
    }
});

// Lấy sản phẩm theo danh mục
router.get('/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const products = await Product.find({ 
            category, 
            isActive: true 
        }).sort({ createdAt: -1 });
        
        res.json({
            success: true,
            data: products,
            message: `Lấy danh sách ${category} thành công`
        });
    } catch (error) {
        console.error('Lỗi lấy sản phẩm theo danh mục:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy sản phẩm theo danh mục'
        });
    }
});

module.exports = router;