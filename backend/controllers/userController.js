import validator from "validator"
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'; // Para gerar nomes de arquivo únicos
import path from 'path'; // Para obter a extensão do arquivo
import razorpay from 'razorpay'


// API to register user
const registerUser = async (req, res) => {
    try {
      // Prisma Client is available via req.prisma
      const prisma = req.prisma;

      const { name, email, password } = req.body

      if ( !name || !email || !password ) {
        return res.json({success: false, message: "Missing Details"})
      }
      // validating email format 
      if ( !validator.isEmail(email)) {
        return res.json({success: false, message: "Enter a valid email"})
      }
      // validating strong password
      if ( password.length < 8 ) {
        return res.json({success: false, message: "Enter a strong password"})
      }

      // hashing user password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.json({ success: false, message: "User already exists" });
      }

      const user = await prisma.user.create({
        data: {
        name,
        email,
        password : hashedPassword
      }});

      const token = jwt.sign({id:user.id}, process.env.JWT_SECRET) // Usando user.id (Int)

      res.json({success: true, token})

    } catch (error){
      console.log(error)
      res.json({success: false, message: error.message})  
    }
}

// API for user login 
const loginUser = async (req, res) => {

  try{
    // Prisma Client is available via req.prisma
    const prisma = req.prisma;

    const {email, password} = req.body
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.json({success: false, message: "User does not exist"})
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (isMatch) {
      const token = jwt.sign({id:user.id}, process.env.JWT_SECRET) // Usando user.id (Int)
      return res.json({success: true, token})
    } else {
      res.json({success: false, message: "Invalid credentials"})
    }

  } catch (error){
    console.log(error)
    res.json({success: false, message: error.message})  
  }

}

// API to get user profile data
const getProfile = async (req, res) => {

  try{
    // Prisma Client is available via req.prisma
    const prisma = req.prisma;

    const { userId } = req.body
    const userData = await prisma.user.findUnique({ where: { id: parseInt(userId) }, select: { password: false } }); // Converte userId para Int

    res.json({ success: true, userData })

  } catch (error) {
    console.log(error)
    res.json({success: false, message: error.message}) 
  }

}

// API to update user profile
const updateProfile = async (req, res) => {
  try{
    // Prisma Client is available via req.prisma
    const prisma = req.prisma;

    const { userId, name, phone, address, dob, gender } = req.body
    const imageFile = req.file

    if( !name || !phone || !dob || !gender ){
       return res.json({ success: false, message: "Data Missing"})
    }

    await prisma.user.update({ // Converte userId para Int
      where: { id: userId },
      data: {
        name,
        phone,
        address: JSON.parse(address), // Prisma pode armazenar JSON diretamente
        dob: dob ? new Date(dob) : null, // Converter para Date se existir
        gender,
      },
    });

    if (imageFile) {
      // --- INÍCIO DA CORREÇÃO PARA IMAGENS ---
      // Substituindo Cloudinary por uma referência local/DB
      
      // Gerar um nome de arquivo único para a imagem
      const uniqueFilename = uuidv4() + path.extname(imageFile.originalname);
      // Aqui você adicionaria a lógica para salvar imageFile.buffer em um local permanente
      // Por exemplo: fs.writeFileSync(path.join('/caminho/para/uploads', uniqueFilename), imageFile.buffer);
      // E então armazenaria o caminho/nome no banco de dados.
      const imageURL = `/uploads/${uniqueFilename}`; // Exemplo de URL/caminho a ser salvo no DB
      await prisma.user.update({
        where: { id: parseInt(userId) }, // Converte userId para Int
        data: { image: imageURL },
      });
      // --- FIM DA CORREÇÃO PARA IMAGENS ---
    }

    res.json({ success: true, message: "Profile Updated" })

  } catch (error) {
    console.log(error)
    res.json({success: false, message: error.message}) 
  }
}

// API to book appointment 
const bookAppointment = async (req, res) => {
   try {
    // Prisma Client is available via req.prisma
    const prisma = req.prisma;
    
    const { userId, docId, slotDate, slotTime } = req.body

    const docData = await prisma.doctor.findUnique({ where: { id: parseInt(docId) }, select: { password: false, fees: true, available: true, slots_booked: true } }); // Converte docId para Int

    if (!docData.available) {
      return res.json({ success: false, message: 'Doctor not available'})
    }

    let slots_booked = docData.slots_booked

    // Ensure slots_booked is an object, even if null from DB
    if (!slots_booked) {
      slots_booked = {};
    }

    // checking for slot availablity
    if (slots_booked[slotDate]) { // slots_booked é um Json, então acessamos como objeto
      if (slots_booked[slotDate].includes(slotTime)) { // Assumindo que slots_booked[slotDate] é um array de strings
        return res.json({ success: false, message: 'Doctor not available'})
      } else {
        slots_booked[slotDate].push(slotTime) // Adiciona o novo slot
      }
    } else {
      slots_booked[slotDate] = []
      slots_booked[slotDate].push(slotTime)
    }

    // Atualizar os slots_booked do doutor no banco de dados
    await prisma.doctor.update({
      where: { id: parseInt(docId) }, // Converte docId para Int
      data: { slots_booked: slots_booked }, // Salva o objeto JSON atualizado
    });

    // --- NOTA DE COMPATIBILIDADE COM PRISMA ---
    // No Prisma, você não armazenaria 'userData' e 'docData' como objetos aninhados diretamente aqui.
    // Em vez disso, 'userId' e 'docId' seriam chaves estrangeiras, e você usaria 'include'
    // para carregar os dados do usuário e do médico ao consultar o agendamento.
    // Para criar o agendamento, basta referenciar os IDs.
    const newAppointment = await prisma.appointment.create({
      data: {
        userId: parseInt(userId), // Converte userId para Int
        docId: parseInt(docId),   // Converte docId para Int
        amount: docData.fees,
        slotDate,
        slotTime,
        date: new Date() // Usa new Date() para o tipo DateTime
      },
    });

    res.json({success: true, message: 'Appointment Booked'})

   } catch (error) {
     console.log(error)
     res.json({success: false, message: error.message})    
   }   
  
}

// API to get user appointment for frontend my-appointments page
const listAppointment = async (req, res) => {
  try {
    // Prisma Client is available via req.prisma
    const prisma = req.prisma;

    const {userId} = req.body
    const appointments = await prisma.appointment.findMany({ where: { userId: parseInt(userId) } }); // Converte userId para Int

    res.json({success: true, appointments})
    
  } catch (error) {
    console.log(error)
    res.json({success: false, message: error.message})  
  }
}

// API to cancel appointment 
const cancelAppointment = async (req, res) => {
  try {
    // Prisma Client is available via req.prisma
    const prisma = req.prisma;
    
    const {userId, appointmentId} = req.body
    const appointmentData = await prisma.appointment.findUnique({ where: { id: parseInt(appointmentId) } }); // Converte appointmentId para Int

    // verify appointment user
    if (appointmentData.userId !== userId) {
        return res.json({success:false, message: 'Unauthorized action'})
    }

    await prisma.appointment.update({
      where: { id: parseInt(appointmentId) }, // Converte appointmentId para Int
      data: { cancelled: true },
    });

    // releasing doctor slot
    const {docId, slotDate, slotTime} = appointmentData

    const doctorData = await prisma.doctor.findUnique({ where: { id: parseInt(docId) } }); // Converte docId para Int

    let slots_booked = doctorData.slots_booked

    // Ensure slots_booked is an object and the date key exists
    if (slots_booked && slots_booked[slotDate]) {
      slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
    }

    // Atualizar os slots_booked do doutor no banco de dados
    await prisma.doctor.update({
      where: { id: parseInt(docId) }, // Converte docId para Int
      data: { slots_booked: slots_booked }, // Salva o objeto JSON atualizado
    });

    res.json({success: true, message: 'Appointment Cancelled'})

  } catch (error) {
    console.log(error)
    res.json({success: false, message: error.message}) 
  }
}

const getRazorpayInstance = () => {
  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env

  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    return null
  }

  return new razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  })
}

// API to make payment of appointment using razorpay
const paymentRazorpay = async (req, res) => {

  try {
    // Prisma Client is available via req.prisma
    const prisma = req.prisma;

    const razorpayInstance = getRazorpayInstance()

    if (!razorpayInstance) {
      return res.status(503).json({
        success: false,
        message: 'Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend/.env.',
      })
    }

    const { appointmentId } = req.body
    const appointmentData = await prisma.appointment.findUnique({ where: { id: parseInt(appointmentId) } }); // Converte appointmentId para Int
  
    if (!appointmentData || appointmentData.cancelled) {
      return res.json({ success: false, message: "Appointment Cancelled or not found"})
    }
  
    // creating options for razorpay payment
    const options = {
      amount: appointmentData.amount * 100,
      currency: process.env.CURRENCY,
      receipt: appointmentId,
    }
  
    // creation of an order
    const order = await razorpayInstance.orders.create(options)
  
    res.json({ success: true, order })
    
  } catch (error) {
    console.log(error)
    res.json({success: false, message: error.message})
  }
  
}



export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment }
