import { PrismaClient } from '@prisma/client';
// @ts-ignore
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const DEFAULT_PASSWORD = '123456';

const seedData = {
    roles: [
        { name: 'admin' },
        { name: 'manager' },
        { name: 'staff' },
    ],
    tables: Array.from({ length: 10 }).map((_, i) => ({
        code: `A${i + 1}`,
        name: `Bàn ${i + 1}`,
    })),
    categories: [
        { name: 'Trà sữa', products: [
                { name: 'Trà sữa trân châu', price: 25000 },
                { name: 'Trà sữa matcha', price: 30000 },
                { name: 'Trà sữa socola', price: 28000 },
            ]},
        { name: 'Cà phê', products: [
                { name: 'Cà phê sữa', price: 20000 },
                { name: 'Cà phê đen', price: 18000 },
                { name: 'Bạc xỉu', price: 22000 },
            ]},
        { name: 'Nước ép', products: [
                { name: 'Nước cam', price: 25000 },
                { name: 'Nước ép táo', price: 27000 },
                { name: 'Nước ép dưa hấu', price: 23000 },
            ]},
        { name: 'Sinh tố', products: [
                { name: 'Sinh tố xoài', price: 30000 },
                { name: 'Sinh tố bơ', price: 35000 },
                { name: 'Sinh tố dâu', price: 32000 },
            ]},
        { name: 'Trà trái cây', products: [
                { name: 'Trà đào cam sả', price: 28000 },
                { name: 'Trà vải', price: 26000 },
                { name: 'Trà chanh dây', price: 27000 },
            ]},
        { name: 'Đồ ăn vặt', products: [
                { name: 'Khoai tây chiên', price: 25000 },
                { name: 'Gà rán', price: 35000 },
                { name: 'Xúc xích', price: 20000 },
            ]},
        { name: 'Mì & nui', products: [
                { name: 'Mì xào bò', price: 40000 },
                { name: 'Nui xào hải sản', price: 45000 },
            ]},
        { name: 'Cơm', products: [
                { name: 'Cơm gà', price: 45000 },
                { name: 'Cơm sườn', price: 50000 },
            ]},
        { name: 'Bánh ngọt', products: [
                { name: 'Bánh bông lan trứng muối', price: 30000 },
                { name: 'Bánh tiramisu', price: 35000 },
            ]},
        { name: 'Ăn sáng', products: [
                { name: 'Bánh mì ốp la', price: 20000 },
                { name: 'Bánh mì thịt nướng', price: 25000 },
            ]},
    ],
    options: [
        { name: 'Đường', multiple: false, items: ['0%', '50%', '100%'] },
        { name: 'Đá', multiple: false, items: ['Ít đá', 'Đá vừa', 'Đá nhiều'] },
        { name: 'Size', multiple: false, items: ['Nhỏ', 'Vừa', 'Lớn'] },
        { name: 'Topping', multiple: true, items: ['Trân châu', 'Thạch', 'Pudding'] },
    ],
};

async function main() {
    console.log('⏳ Clearing old data...');
    await prisma.$executeRawUnsafe(
        `TRUNCATE TABLE "OrderDetail","Order","Table","Product","Category","Option","User","Role" RESTART IDENTITY CASCADE;`
    );

    console.log('🌱 Seeding roles...');
    await prisma.role.createMany({ data: seedData.roles });
    const roles = await prisma.role.findMany();

    console.log('🌱 Seeding users...');
    for (const role of roles) {
        for (let i = 1; i <= 3; i++) {
            const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);
            await prisma.user.create({
                data: {
                    username: `${role.name}${i}`,
                    password: hashedPassword,
                    roles: { connect: { id: role.id } },
                },
            });
        }
    }

    console.log('🌱 Seeding tables...');
    await prisma.table.createMany({ data: seedData.tables });

    console.log('🌱 Seeding categories & products...');
    for (const cat of seedData.categories) {
        const category = await prisma.category.create({ data: { name: cat.name } });
        for (const prod of cat.products) {
            await prisma.product.create({
                data: {
                    name: prod.name,
                    price: prod.price,
                    categories: { connect: { id: category.id } },
                },
            });
        }
    }

    console.log('🌱 Seeding options...');
    for (const opt of seedData.options) {
        await prisma.option.create({
            data: {
                name: opt.name,
                multiple: opt.multiple,
                items: opt.items,
            },
        });
    }

    console.log('🌱 Seeding sample orders...');
    const tables = await prisma.table.findMany();
    const products = await prisma.product.findMany();

    for (let i = 0; i < 10; i++) {
        const table = tables[i % tables.length];

        // random 2–3 products
        const randomProducts = products.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 2);

        const details = randomProducts.map((p) => ({
            productId: p.id,
            qty: 1,
            price: p.price,
            totalAmount: p.price,
        }));

        const totalAmount = details.reduce((sum, d) => sum + d.totalAmount, 0);

        await prisma.order.create({
            data: {
                code: `ORD${i + 1}`,
                tableId: table.id,
                totalAmount,
                orderStatus: 1,
                paymentStatus: 0,
                details: { create: details },
            },
        });
    }

    console.log('✅ Seeding completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
