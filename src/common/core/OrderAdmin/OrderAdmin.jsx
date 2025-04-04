import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getAllOrder } from '../../../services/operations/orderAPI'
import { toast } from 'react-hot-toast'

const OrderAdmin = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [orders, setOrders] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await getAllOrder()
        const orderData = response.order
        setOrders(orderData)
        console.log("order", orderData)
        setError(null)
      } catch (err) {
        console.error("Error fetching order details:", err)
        setError("Error fetching order details")
        toast.error("Error fetching order details")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [])

  const handleRowClick = (orderId) => {
    navigate(`/order-admin/${orderId}`)
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen">{error}</div>
  }

  return (
    <div className="container mx-auto p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Total Price</th>
              <th className="py-2 px-4 border-b">Payment Status</th>
              <th className="py-2 px-4 border-b">Order Date</th>
              <th className="py-2 px-4 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id} onClick={() => handleRowClick(order._id)} className="hover:bg-gray-50 cursor-pointer">
                <td className="py-2 px-4 border-b">{order.firstName} {order.lastName}</td>
                <td className="py-2 px-4 border-b">{order.totalPrice}</td>
                <td className="py-2 px-4 border-b">{order.paymentStatus}</td>
                <td className="py-2 px-4 border-b">{new Date(order.orderDate).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default OrderAdmin
