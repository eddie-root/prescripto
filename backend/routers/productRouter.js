import express from "express";
import { 
  createProduct, 
  getProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct 
} from "../controllers/productController.js";
import { upload } from "../middleware/multer.js";

const productRouter = express.Router();

// Adicionado upload.array('image') para capturar múltiplos arquivos
productRouter.post("/", upload.array('image'), createProduct);
productRouter.get("/", getProducts);
productRouter.get("/:id", getProductById);
productRouter.put("/:id", upload.array('image'), updateProduct);
productRouter.delete("/:id", deleteProduct);

export default productRouter;
