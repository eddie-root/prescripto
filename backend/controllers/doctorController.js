// --- NOTA DE COMPATIBILIDADE COM PRISMA ---
// Este arquivo não lida diretamente com imagens.
// Os campos 'available' (Boolean) e a projeção de '-password', '-email'
// são compatíveis com o Prisma, que usaria 'Boolean' e 'select' para projeção.
// 'slots_booked' seria um campo Json ou uma entidade separada no Prisma.
const changeAvailablity = async (req, res) => {
    try{
        // Prisma Client is available via req.prisma
        const prisma = req.prisma;

        const {docId} = req.body

        const docData = await prisma.doctor.findUnique({ where: { id: parseInt(docId) } }); // Converte docId para Int
        await prisma.doctor.update({ where: { id: parseInt(docId) }, data: { available: !docData.available } }); // Converte docId para Int
        res.json({success: true, message: 'Availability Changed'})

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

const doctorList = async (req, res) => {
    try {
        // Prisma Client is available via req.prisma
        const prisma = req.prisma;
        const doctors = await prisma.doctor.findMany({ select: { password: false, email: false } });

        res.json({success: true, doctors})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

export {changeAvailablity, doctorList}