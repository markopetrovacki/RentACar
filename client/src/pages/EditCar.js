import { Col, Row, Input, Form } from 'antd'
import React, {useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import DefaultLayout from '../components/DefaultLayout'
import Spinner from '../components/Spinner'
import { addCar, editCar, getAllCars } from '../redux/actions/carsActions'



function EditCar({match}) {

    const { carid } = useParams();
    const {cars} = useSelector(state=>state.carsReducer)
    const dispatch = useDispatch()
    const {loading} = useSelector(state=>state.alertsReducer)
    const [car, setcar] = useState()
    const [totalcars, settotalcars] = useState([])

    useEffect(()=> {
        
        if (cars.length == 0) {
            dispatch(getAllCars())
          }
          else {
            settotalcars(cars)
            //cars.find(o => String(o._id) === carid)
            setcar(cars.find(o => String(o._id) === carid));
            //const setcar = cars.find(o=>o._id==(carid))
            //setcar(cars.find(o=>o._id==match.params.carid)) //ako nece da radi onda ne prepoznaje ovo params vrv
            console.log(car)
          }
      }, [cars])

    function onFinish(values){

        values._id = car._id

        dispatch(editCar(values))
        console.log(values)
    }


  return (
    <DefaultLayout>
        {loading && (<Spinner />)}
        <Row justify='center mt-5'>
            <Col lg={12} sm={24} xs={24} className='p-2'>
                {totalcars.length > 0 && (
                    <Form initialValues={car} className='bs1 p-2' layout='vertical' onFinish={onFinish}>
                    <h3>Edit New Car</h3>
                   
                    <hr />
                    <Form.Item name='name' label='Car name' rules={[{required: true}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name='image' label='Image url' rules={[{required: true}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name='rentPerHour' label='Rent per hour' rules={[{required: true}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name='capacity' label='Capacity' rules={[{required: true}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name='fuelType' label='Fuel Tupe' rules={[{required: true}]}>
                        <Input/>
                    </Form.Item>

                    <div className='text-right'>
                    <button className='btn1'>Edit CAR</button>
                    </div>
                
                </Form>
                )}
            </Col>
        </Row>

    </DefaultLayout>
  )
}

export default EditCar