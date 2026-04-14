import { PrismaClient } from "@prisma/client";
import cloudinary from "../configs/cloudinary.js";

const prisma = new PrismaClient();

// Função para upload no Cloudinary usando stream
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'products' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

// CRIAR PRODUTO
export const createProduct = async (req, res) => {
  try {
    const { cod, name, category, description, prices: pricesRaw } = req.body;
    let imageUrl = null;

    if (req.files && req.files.length > 0) {
      imageUrl = await uploadToCloudinary(req.files[0].buffer);
    } else if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    // Parse dos preços
    let pricesData = [];
    try {
      pricesData = typeof pricesRaw === 'string' ? JSON.parse(pricesRaw) : pricesRaw;
    } catch (e) {
      return res.status(400).json({ success: false, message: "Formato de preços inválido." });
    }
    
    // Normalização para o Prisma: Garante que seja um Array de Objetos [{letter, price}]
    let pricesCreate = [];
    if (Array.isArray(pricesData)) {
      pricesCreate = pricesData
        .filter(item => item.letter && !isNaN(Number(item.price)))
        .map(item => ({
          letter: String(item.letter),
          price: Math.round(Number(item.price))
        }));
    } else if (typeof pricesData === 'object' && pricesData !== null) {
      pricesCreate = Object.entries(pricesData)
        .filter(([_, price]) => !isNaN(Number(price)))
        .map(([letter, price]) => ({
          letter: String(letter),
          price: Math.round(Number(price))
        }));
    }

    if (pricesCreate.length === 0) {
      return res.status(400).json({ success: false, message: "Ao menos um preço válido deve ser fornecido." });
    }

    // VERIFICAÇÃO PROATIVA: Evita o erro no log do Prisma
    const existingProduct = await prisma.product.findUnique({
      where: { cod }
    });

    if (existingProduct) {
      return res.status(400).json({ 
        success: false, 
        message: "O produto já existe" 
      });
    }

    const product = await prisma.product.create({
      data: {
        cod,
        name,
        category,
        description,
        image: imageUrl,
        prices: {
          create: pricesCreate
        }
      },
      include: { prices: true }
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    // Apenas logamos erros que NÃO sejam de duplicidade (que agora já tratamos acima)
    if (error.code !== 'P2002') {
      console.error("Erro inesperado ao criar produto:", error);
    }
    
    res.status(500).json({ success: false, message: "Erro ao processar produto: " + error.message });
  }
};

// LISTAR TODOS
export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { prices: true },
      orderBy: { cod: 'asc' }
    });
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao listar: " + error.message });
  }
};

// BUSCAR POR ID OU CÓDIGO
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const isNumeric = !isNaN(Number(id));
    
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          isNumeric ? { id: Number(id) } : undefined,
          { cod: id }
        ].filter(Boolean)
      },
      include: { prices: true }
    });

    if (!product) return res.status(404).json({ success: false, message: "Produto não encontrado" });
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao buscar: " + error.message });
  }
};

// ATUALIZAR PRODUTO
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { cod, name, category, description, prices: pricesRaw, image: existingImage } = req.body;
    
    let imageUrl = existingImage;
    if (req.files && req.files.length > 0) {
      imageUrl = await uploadToCloudinary(req.files[0].buffer);
    } else if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    let pricesCreate = [];
    if (pricesRaw) {
      const pricesData = typeof pricesRaw === 'string' ? JSON.parse(pricesRaw) : pricesRaw;
      
      if (Array.isArray(pricesData)) {
        pricesCreate = pricesData
          .filter(item => item.letter && !isNaN(Number(item.price)))
          .map(item => ({
            letter: String(item.letter),
            price: Math.round(Number(item.price))
          }));
      } else {
        pricesCreate = Object.entries(pricesData)
          .filter(([_, price]) => !isNaN(Number(price)))
          .map(([letter, price]) => ({
            letter: String(letter),
            price: Math.round(Number(price))
          }));
      }
    }

    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        cod,
        name,
        category,
        description,
        image: imageUrl,
        prices: {
          deleteMany: {},
          create: pricesCreate
        }
      },
      include: { prices: true }
    });

    res.json({ success: true, product });
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    res.status(500).json({ success: false, message: "Erro ao atualizar: " + error.message });
  }
};

// DELETAR
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.productPrice.deleteMany({ where: { productId: Number(id) } });
    await prisma.product.delete({ where: { id: Number(id) } });
    res.json({ success: true, message: "Produto deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao deletar: " + error.message });
  }
};
