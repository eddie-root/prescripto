import validator from "validator"
import bcrypt from 'bcrypt'
// Para gerar nomes de arquivo únicos e manipular caminhos
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import doctorModel from '../models/doctorModel.js'
import jwt from 'jsonwebtoken'

// API for adding doctor
const addDoctor = async (req, res) => {
    try{
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
        const imageFile = req.file

        // checking for all data to add doctor
        if( !name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address){
            return res.json({success: false, message: "Missing Details"})
        }

        // validating email format
        if( !validator.isEmail(email)){
            return res.json({success: false, message: "Please enter a valid email"})
        }

        // validating strong password
        if( password.lenght < 8 ){
            return res.json({success: false, message: "Please enter a strong password"})
        }

        // hashing doctor password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // --- INÍCIO DA CORREÇÃO PARA IMAGENS ---
        // Substituindo Cloudinary por uma referência local/DB
        
        // Gerar um nome de arquivo único para a imagem
        const uniqueFilename = uuidv4() + path.extname(imageFile.originalname);
        // Aqui você adicionaria a lógica para salvar imageFile.buffer em um local permanente
        // Por exemplo: fs.writeFileSync(path.join('/caminho/para/uploads', uniqueFilename), imageFile.buffer);
        // E então armazenaria o caminho/nome no banco de dados.
        const imageUrl = `/uploads/${uniqueFilename}`; // Exemplo de URL/caminho a ser salvo
        // --- FIM DA CORREÇÃO PARA IMAGENS ---

        const doctorData = { // --- NOTA DE COMPATIBILIDADE COM PRISMA ---
            name,
            email,
            password:hashedPassword,
            image:imageUrl,
            speciality,
            degree,
            experience,
            about,
            fees,
            address:JSON.parse(address),
            date: Date.now() // Prisma usaria DateTime
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()

        res.json({success: true, message: "Doctor Added"})

    } catch (error){
        console.log(error)
        res.json({success:false, message: error.message})
    }
}

// API For admin Login
const loginAdmin = async (req, res) => {
    try{

        const {email,password} = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            
            const token = jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({success:true,token})

        } else {
            res.json({success:false, message: "Invalid credentials"})
        }

    } catch (error){
        console.log(error)
        res.json({success:false, message: error.message}) 
    }
}

// API to get all doctors list for admin panel
const allDoctors = async (req, res) => {
    try{

        const doctors = await doctorModel.find({}).select('-password')
        res.json({success: true, doctors})

    }catch (error){
        console.log(error)
        res.json({success:false, message: error.message}) 
    }
}

export {addDoctor, loginAdmin, allDoctors}