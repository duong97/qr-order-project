import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getCategories = async (req: Request, res: Response) => {
    const categories = await prisma.category.findMany();
    res.json(categories);
};

export const getCategory = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) return res.status(404).json({ message: "Not found" });
    res.json(category);
};

export const createCategory = async (req: Request, res: Response) => {
    const { name } = req.body;
    const category = await prisma.category.create({ data: { name } });
    res.status(201).json(category);
};

export const updateCategory = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { name } = req.body;
    const category = await prisma.category.update({
        where: { id },
        data: { name }
    });
    res.json(category);
};

export const deleteCategory = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await prisma.category.delete({ where: { id } });
    res.json({ message: "Deleted" });
};
