import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import DefaultLayout from '../components/DefaultLayout'
import Spinner from '../components/Spinner'
import { getAllCars } from '../redux/actions/carsActions'
import { Button, Row, Col, Divider, DatePicker, Checkbox, Modal } from 'antd';
import moment from 'moment'
import { bookCar } from '../redux/actions/bookingActions'
import StripeCheckout from 'react-stripe-checkout';
import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles

const { RangePicker } = DatePicker

function BookingCar({ match }) {

  const { carid } = useParams();

  const { cars } = useSelector(state => state.carsReducer)
  const { loading } = useSelector(state => state.alertsReducer)
  const [car, setcar] = useState({});
  const dispatch = useDispatch()
  const [from, setFrom] = useState()
  const [to, setTo] = useState()
  const [totalHours, setTotalHours] = useState(0)
  const [driver, setdriver] = useState(false)
  const [totalAmount, setTotalAmount] = useState(0)
  const [showModal, setShowModal] = useState(false)


  useEffect(() => {

    if (cars.length == 0) {
      dispatch(getAllCars())
    }
    else {
      //cars.find(o => String(o._id) === carid)
      setcar(cars.find(o => String(o._id) === carid));
      //const setcar = cars.find(o=>o._id==(carid))
      //setcar(cars.find(o=>o._id==match.params.carid)) //ako nece da radi onda ne prepoznaje ovo params vrv
    }
  }, [cars])

  useEffect(() => {

    setTotalAmount((totalHours * car.rentPerHour))
    if (driver) {
      setTotalAmount(totalAmount + (30 * totalHours))
    }

  }, [driver, totalHours])

  function selectTimeSlots(values) {

    setFrom((moment(values[0]).format('MMM DD yyyy HH:mm')))
    setTo((moment(values[1]).format('MMM DD yyyy HH:mm')))

    setTotalHours(values[1].diff(values[0], 'hours'))
  }

  

  function onToken(token){
    
    const reqObj = {
      token,
      user: JSON.parse(localStorage.getItem('user'))._id,
      car: car._id,
      totalHours,
      totalAmount,
      driverRequired: driver,
      bookedTimeSlots: {
        from,
        to
      }
    }
    dispatch(bookCar(reqObj))

  }

  return (
    <DefaultLayout>

      {loading && (<Spinner />)}
      {car && (
        <Row justify='center' className='d-flex align-items-center' style={{ minHeight: '90vh' }}>
          <Col lg={10} sm={24} xs={24} className='p-3'>
            <img src={car.image} className="carimg2 bs1 w-100 " data-aos='flip-left' data-aos-duration='1500'/>
          </Col>
          <Col lg={10} sm={24} xs={24} className="text-right">
            <Divider type='horizontal' dashed>Car info</Divider>
            <div style={{ textAling: 'right' }}>
              <p>{car.name}</p>
              <p>Rent per hour /- {car.rentPerHour} </p>
              <p>Fuel type: {car.fuelType}</p>
              <p>Max Persons : {car.capacity}</p>
            </div>

            <Divider type='horizontal' dashed>Select Time Slots</Divider>
            <RangePicker showTime={{ format: 'HH:mm' }} format='MMM DD yyyy HH:mm' onChange={selectTimeSlots} />

            <br />
            <button className='btn1 mt-2' onClick={() => { setShowModal(true) }}>See Booked Slots</button>
            {from && to && (
              <div>
                <p>Total Hours: <b>{totalHours}</b></p>
                <p>Rent Per Hour: <b>{car.rentPerHour}</b></p>
                <Checkbox onChange={(e) => {
                  if (e.target.checked) {
                    setdriver(true);
                  }
                  else {
                    setdriver(false);
                  }
                }}>Driver Required</Checkbox>

                <h3>Total Amount: {totalAmount}</h3>

                <StripeCheckout 
                shippingAddress 
                token={onToken} 
                currency='eur'
                amount = {totalAmount * 100}
                stripeKey="pk_test_51LUQwuG8zN8FyI0EeQYyTW8AtMHauyRYbg7l5DGZ2VyP1p2PoGqTbBIpIRS1Menv6VzVzXwiiO0gpETr4p6DIrOx00kfS7Zwc4"
                >

                <button className='btn1'>Book Now</button>

                </StripeCheckout>


                
              </div>
            )}
          </Col>

          {car.name && (
             <Modal visible={showModal} closable={false} footer={false} title='Booked time slots'>

             {cars.length && (
               <div className='p-2'>
 
                 {car.bookedTimeSlots.map(slot => {
 
                   return <button className='btn1 mt-2'>{slot.from} - {slot.to}</button>
 
                 })}
 
                 <div className='text-right mt-5'>
 
                   <button className='btn1' onClick={() => { setShowModal(false) }}>CLOSE</button>
 
                 </div>
 
               </div>
             )}
 
           </Modal>
          )}
         

        </Row>


      )}



    </DefaultLayout>
  )
}

export default BookingCar