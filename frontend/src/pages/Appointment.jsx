import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets } from '../assets/assets.js'
import { toast } from 'react-hot-toast'
import { useApp } from '../context/AppContext.jsx'
import formatCurrency from '../utils/money'


const Appointment = () => {

  const { docId } = useParams();
  const navigate = useNavigate();
  const { doctors, token } = useApp();
  const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Inicialize docInfo com null para indicar que os dados ainda não foram carregados
  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');

  const bookAppointment = () => {
    if (!token) {
      toast.warn('Login to book appointment')
      return navigate('/login')
    }

    try {
      const date = docSlots[slotIndex][0].datetime;

      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      const slotDate = day + '/' + month + '/' + year;


      if (data.success) {
        toast.success(data.message)
        getDoctorsData();
        navigate('/my-appointments')
      } else {
        toast.error(data.message)
      }
    
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  }


  useEffect(() => {
    const fetchDocInfo = () => {
      // Use .find() para obter o objeto do doutor, não um array
      // Certifique-se de que docId (string) e doc._id (assumindo string) são comparados corretamente
      const selectedDoc = doctors.find((doc) => doc._id === docId);
      setDocInfo(selectedDoc);
    };
    fetchDocInfo();
    // A dependência 'doctors' não é necessária se o array 'doctors' for estático (importado de assets.js)
    // Se 'doctors' pudesse mudar (ex: vindo de uma API), ele deveria estar aqui.
  }, [docId]); // Re-executa o efeito apenas se docId mudar
  
  // Adicione uma verificação para garantir que docInfo não é null antes de tentar renderizar
  if (!docInfo) {
    // Você pode exibir um spinner de carregamento, uma mensagem de "não encontrado" ou redirecionar
    return <div>Carregando informações do doutor...</div>;
  }

  return (
    <div>
      {/* /---------------- Doctors Details ---------------------------- */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <img src={docInfo.image} alt={docInfo.name} className="w-full sm:w-1/3 object-cover rounded-lg shadow-md" />
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-gray-800">{docInfo.name}
            <img className='w-5' src={assets.verified_icon} alt="" />
          </h2>
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p >{docInfo.degree} - {docInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>     
          </div>
          {/* /---------------- Doctor about -------------------------- */}
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
              About <img src={assets.info_icon} alt="" />
            </p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'> {docInfo.about}</p>
          </div>
          <p className='text-gray-500 font-medium mt-4'>
            Appointment fee: <span className='text-gry-600'> {formatCurrency(docInfo.fees)}</span>
          </p>
          
        </div>
      </div>

       {/* /---------------- Booking Slots -------------------------- */}
       <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
          <p>Booking Slots</p>
          <div className='flex gap-3 items-center overflow-x-scroll mt-4'>
            {
              docSlots.length && docSlots.map((item, index)=> (
                <div 
                  onClick={()=> setSlotIndex(index)}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-300'}`} 
                  key={index} 
                >
                  <p>{item[0] && dayOfWeek[item[0].datetime.getDay()]}</p>
                  <p>{item[0] && item[0].datetime.getDate()}</p>
                </div>
              ))
            }
          </div>

          <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4' >
            {docSlots.length && docSlots[slotIndex].map((item, index)=> (
              <p 
                onClick={()=> setSlotTime(item.time)}
                key={index}
                className={`text-sm font-ligth flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'border border-gray-300'}`}
              >
                {item.time.toLowerCase()}
              </p>
            ))}
          </div>
          <button
            onClick={bookAppointment}
            className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6 cursor-pointer'
          >
            Book an Appointment
          </button>
       </div>
     {/* /---------------- Listing Related Doctors-------------------------- */}
      
    </div>
  )
}

export default Appointment
