// import multer from "multer";

// export const upload = multer({ 
//     storage: multer.diskStorage({})}
// );

import multer from 'multer';

// memoryStorage = arquivo fica na memória RAM, não salva no disco
const storage = multer.memoryStorage();

export const upload = multer({ storage });