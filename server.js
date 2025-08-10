const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');
const Transaction = require('./models/Transaction'); // Import model

const app = express();
const port = 3000;

// Middleware cơ bản
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files từ thư mục hiện tại
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')));

// Kết nối MongoDB với error handling
mongoose.connect('mongodb://localhost:27017/coffeemanager')
.then(() => console.log(' MongoDB kết nối thành công'))
.catch(err => {
    console.error('❌ Lỗi MongoDB:', err.message);
    console.log('💡 Hướng dẫn: Đảm bảo MongoDB đang chạy bằng lệnh: mongod');
});

// ==== SCHEMAS ====
// Chỉ định nghĩa userSchema trong server.js
const userSchema = new mongoose.Schema({
    fullName: String,
    email: { type: String, unique: true },
    phone: String,
    password: String,
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// ==== ROUTES ====
// Trang chính
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Dangnhap.html'));
});
// Route backup cho đăng nhập
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'Dangnhap.html'));
});

app.get('/Dangnhap.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'Dangnhap.html'));
});

// Kiểm tra server
app.get('/test', (req, res) => {
    res.json({ 
        message: 'Server hoạt động OK!',
        timestamp: new Date().toISOString(),
        mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// Đăng ký
app.post('/api/register', async (req, res) => {
    try {
        const { fullName, email, phone, password, confirmPassword } = req.body;

        if (!fullName || !email || !phone || !password) {
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Mật khẩu không khớp' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã được sử dụng' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ fullName, email, phone, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'Đăng ký thành công!', success: true });
    } catch (error) {
        console.error('Lỗi đăng ký:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// Đăng nhập
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Thiếu username/password' });
        }

        const user = await User.findOne({ $or: [{ email: username }, { phone: username }] });

        if (!user) {
            return res.status(401).json({ message: 'Thông tin đăng nhập không đúng' });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ message: 'Thông tin đăng nhập không đúng' });
        }

        res.json({
            message: 'Đăng nhập thành công!',
            success: true,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// ==== API GIAO DỊCH ====
// Sử dụng router từ transactions.js
const transactionsRouter = require('./routes/transactions');
app.use('/api/transactions', transactionsRouter);

app.delete('/api/transactions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Kiểm tra ID hợp lệ
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID không hợp lệ' });
        }

        const deletedTransaction = await Transaction.findByIdAndDelete(id);
        
        if (!deletedTransaction) {
            return res.status(404).json({ message: 'Không tìm thấy giao dịch' });
        }

        res.json({ 
            message: 'Xóa giao dịch thành công!', 
            success: true,
            deletedTransaction 
        });
    } catch (error) {
        console.error('Lỗi xóa giao dịch:', error);
        res.status(500).json({ message: 'Lỗi server khi xóa giao dịch' });
    }
});

// Route cho các trang HTML khác
app.get('/Thuchi.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'Thuchi.html'));
});

app.get('/goimon.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'goimon.html'));
});

// ==== IMPORT MODELS ====
const Employee = require('./models/Employee');
const Customer = require('./models/Customer');
const Category = require('./models/Category');
const Product = require('./models/Product'); // Thêm Product model

// ==== API ROUTES ====
// Employee routes
const employeesRouter = require('./routes/employees');
app.use('/api/employees', employeesRouter);

// Customer routes  
const customersRouter = require('./routes/customers');
app.use('/api/customers', customersRouter);

// Category routes
const categoriesRouter = require('./routes/categories');
app.use('/api/categories', categoriesRouter);

// Product routes - THÊM MỚI
const productsRouter = require('./routes/products');
app.use('/api/products', productsRouter);

// Route cho các trang HTML
app.get('/nhanvien.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'nhanvien.html'));
});

app.get('/khachhang.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'khachhang.html'));
});

app.get('/danhmuc.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'danhmuc.html'));
});

// Route cho trang sản phẩm
app.get('/Thucdon.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'Thucdon.html'));
});

// ==== SERVER START ====
app.listen(port, () => {
    console.log(` Server chạy tại: http://localhost:${port}`);
    console.log(' Static files từ:', __dirname);
    console.log(' Test API: http://localhost:3000/test');
    console.log(' API giao dịch: http://localhost:3000/api/transactions/all');
    console.log(' API danh mục: http://localhost:3000/api/categories/all');
    console.log(' API sản phẩm: http://localhost:3000/api/products/all');
});

// Handle unhandled errors
process.on('unhandledRejection', err => {
    console.error('❌ Unhandled Rejection:', err.message);
});

process.on('uncaughtException', err => {
    console.error('❌ Uncaught Exception:', err.message);
    process.exit(1);
});