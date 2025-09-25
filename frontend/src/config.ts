import ProductOption from '@/interface/ProductOption'
import Product from "@/interface/Product";

export default {
    firebaseConfig: {
        apiKey: "AIzaSyCtWTTmQJISXvzKqOfkcXhJFMh9yzdxhFI",
        authDomain: "qrtable-demo.firebaseapp.com",
        databaseURL: "https://qrtable-demo-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "qrtable-demo",
        storageBucket: "qrtable-demo.appspot.com",
        messagingSenderId: "603032809238",
        appId: "1:603032809238:web:458b4dd030455e48886a37",
        measurementId: "G-FP4CR155DE"
    },
    firebaseAuth: {
        email: "admin@admin.com",
        password: "123123",
    },
    cfConfig: {
        // apiUrl: "https://qrt.nvduong1211.workers.dev/api",
        // apiUrl: "http://localhost:8787/api", // cloudflare local
        apiUrl: "http://localhost:5001/api",
        socketUrl: "http://localhost:5001",
        apiKey: 'eccfd07c-6ecc-4882-8e4e-f8ac8639a82d',
    },
    uploadImageUrl: 'https://script.google.com/macros/s/AKfycbx_4Tq8CjD2A3ndRRBbWMMsyHgqSbiF-5Whi0I_Qajc8s_uG30fe8bhnK522UOLOywf/exec',
    faCurrencyIcon: 'dong-sign',
    currency: '₫',
    decimalLength: 3,
    tables: ['1A', '1B', '1C', '2A', '2B', '2C'],
    orderStatus: {
        new: 1,
        processing: 2,
    },
    userRole: {
        host: 1,
        friend: 2,
        guest: 3,
    },
    db: {
        categories: [
            {id: 1, name: 'Bánh'},
            {id: 2, name: 'Ăn vặt'},
            {id: 3, name: 'Trái cây'},
            {id: 4, name: 'Nước giải khát'},
            {id: 5, name: 'Combo'},
        ],
        options: [
            {
                id: 1,
                name: 'Topping trân châu',
                multiple: true,
                items: [
                    {id: 1, name: 'Trân châu trắng', price: 5000},
                    {id: 2, name: 'Trân châu đen', price: 5000},
                    {id: 3, name: 'Trân châu thập cẩm', price: 5000},
                ]
            },
            {
                id: 2,
                name: 'Lượng đường',
                multiple: false,
                items: [
                    {id: 1, name: '25%', price: 0},
                    {id: 2, name: '50%', price: 0},
                    {id: 3, name: '75%', price: 0},
                    {id: 4, name: '100%', price: 0, default: true},
                ]
            },
            {
                id: 3,
                name: 'Tùy chọn đá',
                multiple: false,
                items: [
                    {id: 1, name: 'Đá chung', price: 0, default: true},
                    {id: 2, name: 'Đá riêng', price: 0},
                ]
            },
            {
                id: 4,
                name: 'Size',
                multiple: false,
                items: [
                    {id: 1, name: 'M', price: 0, default: true},
                    {id: 2, name: 'L', price: 5000},
                    {id: 23, name: 'XL', price: 15000},
                ]
            },
        ] as ProductOption[],
        products: [
            {
                id: 1,
                name: 'Bánh flan',
                price: 10000,
                description: "Something to that i didn't know. This line will display in second row. And this line is in third row.",
                thumbnail: "/images/bread.jpeg",
                category: 1,
                options: [1, 2]
            },
            {
                id: 2,
                name: 'Panacota',
                price: 30000,
                description: "Something to that i didn't know",
                thumbnail: "/images/bread.jpeg",
                category: 1,
                options: [1, 2]
            },
            {
                id: 3,
                name: 'Tiramisu',
                price: 35000,
                description: "Something to that i didn't know",
                thumbnail: "/images/bread.jpeg",
                category: 1,
                options: [1, 2]
            },
            {
                id: 4,
                name: 'Bánh tráng trộn',
                price: 10000,
                description: "Something to that i didn't know",
                thumbnail: "/images/bread.jpeg",
                category: 2,
                options: [4]
            },
            {
                id: 5,
                name: 'Bánh tráng tắc',
                price: 10000,
                description: "Something to that i didn't know",
                thumbnail: "/images/bread.jpeg",
                category: 2,
                options: [4]
            },
            {
                id: 6,
                name: 'Bánh tráng cuốn',
                price: 10000,
                description: "Something to that i didn't know",
                thumbnail: "/images/bread.jpeg",
                category: 2,
                options: [4]
            },
            {
                id: 7,
                name: 'Xoài',
                price: 10000,
                description: "Something to that i didn't know",
                thumbnail: "/images/bread.jpeg",
                category: 3
            },
            {
                id: 8,
                name: 'Mít',
                price: 10000,
                description: "Something to that i didn't know",
                thumbnail: "/images/bread.jpeg",
                category: 3
            },
            {
                id: 9,
                name: 'Trà đào',
                price: 20000,
                description: "Something to that i didn't know",
                thumbnail: "/images/bread.jpeg",
                category: 4,
                options: [2, 3, 4]
            },
            {
                id: 10,
                name: 'Trà dâu',
                price: 25000,
                description: "Something to that i didn't know",
                thumbnail: "/images/bread.jpeg",
                category: 4,
                options: [2, 3, 4]
            },
            {
                id: 11,
                name: 'Nước mía',
                price: 15000,
                description: "Something to that i didn't know",
                thumbnail: "/images/bread.jpeg",
                category: 4,
                options: [2, 3, 4]
            },
            {
                id: 12,
                name: 'Bánh flan + trà đào',
                price: 50000,
                description: "Something to that i didn't know",
                thumbnail: "/images/bread.jpeg",
                category: 5,
                options: [2, 3, 4]
            },
        ] as Product[],
    }
};