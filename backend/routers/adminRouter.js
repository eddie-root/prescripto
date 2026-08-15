import express from "express";
import { 
  addDoctor
} from "../controllers/adminController.js";
import { upload } from "../middleware/multer.js";

const adminRouter = express.Router();

// Adicionado upload.array('image') para capturar múltiplos arquivos
adminRouter.post("/add-doctor", upload.array('image'), addDoctor);

export default adminRouter;
