import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEye } from 'react-icons/fa';

const CourseNewOrders = () => {
  const [orders, setOrders] = useState([
    {
      id: 1, 
      orderId: '65d97e1e546cb760930b8c6c',
      instructorName: 'Jackie',
      studentName: 'Testing16',
      orderDate: 'Feb 24, 2024',
      orderCost: '450 AUD'
    },
    {
      id: 2, 
      orderId: '65b642741be44b4b5072a4d2',
      instructorName: 'John Moffit',
      studentName: 'Jackie',
      orderDate: 'Jan 28, 2024',
      orderCost: '617.5 USD'
    },
    {
      id: 3, 
      orderId: '655b3a9c8e85330aa958c052',
      instructorName: 'Jackie',
      studentName: 'John Moffit',
      orderDate: 'Nov 20, 2023',
      orderCost: '237.5 USD'
    },
    {
      id: 4, 
      orderId: '655734aa7f42d84163179882',
      instructorName: 'Jackie',
      studentName: 'John Moffit',
      orderDate: 'Nov 17, 2023',
      orderCost: '427.5 AUD'
    },
    {
      id: 5, 
      orderId: '65321e94bc64036c6b778071',
      instructorName: 'John Moffit',
      studentName: 'Appysa',
      orderDate: 'Oct 20, 2023',
      orderCost: '237.5 USD'
    },
    {
      id: 6, 
      orderId: '65259d2d42102302e4475b2',
      instructorName: 'Appysa',
      studentName: 'John Moffit',
      orderDate: 'Oct 11, 2023',
      orderCost: '332.5 USD'
    },
    {
      id: 7, 
      orderId: '6421be9b5fbbed04fe6f3362',
      instructorName: 'John Moffit',
      studentName: 'Jackie',
      orderDate: 'Mar 27, 2023',
      orderCost: '285 USD'
    }
  ]);

  const handleView = (id) => {
    // Implement view functionality
    console.log(`Viewing order with id ${id}`);
  };

  return (
    <div className="container-fluid p-4">
        <div className="card-body">
          <h5 className="card-title mb-4">New Orders</h5>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th className='text-center'>#</th>
                  <th className='text-center'>Order Id</th>
                  <th className='text-center'>Instructor Name</th>
                  <th className='text-center'>Student Name</th>
                  <th className='text-center'>Order Date</th>
                  <th className='text-center'>Order Cost</th>
                  <th className='text-center'>View</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className='text-center'>{order.id}</td>
                    <td className='text-center'>{order.orderId}</td>
                    <td className='text-center'>{order.instructorName}</td>
                    <td className='text-center'>{order.studentName}</td>
                    <td className='text-center'>{order.orderDate}</td>
                    <td className='text-center'>{order.orderCost}</td>
                    <td className='text-center'>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleView(order.id)}
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
};

export default CourseNewOrders;