import doctorModel from '../models/doctorModel.js'

// --- NOTA DE COMPATIBILIDADE COM PRISMA ---
// Este arquivo não lida diretamente com imagens.
// Os campos 'available' (Boolean) e a projeção de '-password', '-email'
// são compatíveis com o Prisma, que usaria 'Boolean' e 'select' para projeção.
// 'slots_booked' seria um campo Json ou uma entidade separada no Prisma.
const changeAvailablity = async (req, res) => {
    try{
        const {docId} = req.body

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId,{available: !docData.available})
        res.json({success: true, message: 'Availability Changed'})

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email'])

        res.json({success: true, doctors})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

export {changeAvailablity, doctorList}