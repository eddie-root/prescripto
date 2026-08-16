import multer from 'multer';

// Configura o Multer para armazenar o arquivo em memória (como um Buffer)
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

export default upload;