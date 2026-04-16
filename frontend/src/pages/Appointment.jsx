import React, { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { assets } from '../assets/assets.js'
import formatCurrency from '../utils/money'
import RelatedDoctors from '../components/RelatedDoctors'


const Appointment = () => {

  const { docId } = useParams();
  const { doctors } = useApp();
  const dayOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  
  // Inicialize docInfo com null para indicar que os dados ainda não foram carregados
  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');

  const getAvailableSlots = useCallback(async () => {
    setDocSlots([]);

    // getting cucrrent date 
    let today = new Date();
    let allSlots = [];
    
    for(let i = 0; i < 7; i++){
      // getting date with index
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i);

      // setting end time of the date with index
      let endTime = new Date(today)
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21,0,0,0);

      // setting hours
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(today.getHours() > 10 ? today.getHours() + 1 : 10);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 0 : 30);
      
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);  
      }

      let timeSlots = [];

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        
        // add slot to away
        timeSlots.push({
          dateTime: new Date(currentDate),
          time: formattedTime
        })

        // Increment curreent time by 30 minutos
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
      allSlots.push(timeSlots);
    }
    setDocSlots(allSlots);
  }, [docInfo]);

  useEffect(() => {
    const fetchDocInfo = () => {
      const selectedDoc = doctors.find((doc) => doc._id === docId);
      setDocInfo(selectedDoc);
    };
    fetchDocInfo();
  }, [docId, doctors]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [docInfo, getAvailableSlots])

  useEffect(() => {
    console.log(docSlots)
  },[docSlots] )

  // Verificação no nível do componente para evitar renderizar com docInfo null
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
          <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
            {
              docSlots.length && docSlots.map((item, index) => (
                <div
                  onClick={()=> setSlotIndex(index)}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-400'  }`} 
                  key={index}
                >
                  <p>{item[0] && dayOfWeek[item[0].dateTime.getDay()]}</p>
                  <p>{item[0] && item[0].dateTime.getDate()}</p>
                </div>
              ))
            }
          </div>

          <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
            {docSlots.length && docSlots[slotIndex].map((item, index) => (
              <p 
                onClick={()=> setSlotTime(item.time)}
                className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-500 border border-gray-400'}`}
                key={index}
              >
                {item.time.toLowerCase()}
              </p>
            ))}
          </div>
          <button className='bg-primary text-white text-md font-light px-14 py-3 rounded-full my-6'>Book an Appointment</button>
          
       </div>
     {/* /---------------- Listing Related Doctors-------------------------- */}
      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  )
}

export default Appointment
