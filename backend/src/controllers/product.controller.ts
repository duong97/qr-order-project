import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()

export const createProduct = async (req: Request, res: Response) => {
    const { name, price, categoryIds } = req.body

    try {
        const product = await prisma.product.create({
            data: {
                name,
                price,
                categories: categoryIds
                    ? {
                        connect: categoryIds.map((id: number) => ({ id })),
                    }
                    : undefined,
            },
            include: { categories: true },
        })

        res.json(product)
    } catch (err) {
        res.status(500).json({ error: 'Lỗi tạo product', details: err })
    }
}

export const getAllProducts = async (req: Request, res: Response) => {
    const products = await prisma.product.findMany({ include: { categories: true } })
    res.json(products)
}

export const getProductById = async (req: Request, res: Response) => {
    const { id } = req.params
    const product = await prisma.product.findUnique({
        where: { id: Number(id) },
        include: { categories: true },
    })
    if (!product) return res.status(404).json({ error: 'Not found' })
    res.json(product)
}

export const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params
    const { name, price, categoryIds } = req.body

    try {
        const product = await prisma.product.update({
            where: { id: Number(id) },
            data: {
                name,
                price,
                categories: categoryIds
                    ? {
                        set: categoryIds.map((id: number) => ({ id })), // set lại toàn bộ
                    }
                    : undefined,
            },
            include: { categories: true },
        })

        res.json(product)
    } catch (err) {
        res.status(500).json({ error: 'Lỗi cập nhật product', details: err })
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params
    await prisma.product.delete({ where: { id: Number(id) } })
    res.json({ message: 'Deleted' })
}
