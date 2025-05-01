import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-semibold mb-6 mt-4">My Orders</h2>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.error || error.error}</Message>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-black-100">
              <th className="py-2 px-3">IMAGE</th>
              <th className="py-2 px-3">ID</th>
              <th className="py-2 px-3">DATE</th>
              <th className="py-2 px-3">TOTAL</th>
              <th className="py-2 px-3">PAID</th>
              <th className="py-2 px-3">DELIVERED</th>
              <th className="py-2 px-3"></th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                className="border-b hover:bg-gray-800 hover:text-white transition-colors"
              >
                <td className="py-2 px-3">
                  <img
                    src={order.orderItems[0].image}
                    alt={order.user}
                    className="w-[5rem] h-[5rem] object-cover rounded"
                  />
                </td>

                <td className="py-2 px-3">{order._id}</td>
                <td className="py-2 px-3">
                  {order.createdAt.substring(0, 10)}
                </td>
                <td className="py-2 px-3">₹ {order.totalPrice}</td>

                <td className="py-2 px-3">
                  {order.isPaid ? (
                    <p className="inline-block text-xs font-semibold text-white bg-green-500 px-2 py-1 rounded-full">
                      Completed
                    </p>
                  ) : (
                    <p className="inline-block text-xs font-semibold text-white bg-red-500 px-2 py-1 rounded-full">
                      Pending
                    </p>
                  )}
                </td>

                <td className="py-2 px-3">
                  {order.isDelivered ? (
                    <p className="inline-block text-xs font-semibold text-white bg-green-500 px-2 py-1 rounded-full">
                      Completed
                    </p>
                  ) : (
                    <p className="inline-block text-xs font-semibold text-white bg-red-500 px-2 py-1 rounded-full">
                      Pending
                    </p>
                  )}
                </td>

                <td className="py-2 px-3">
                  <Link to={`/order/${order._id}`}>
                    <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 text-sm rounded">
                      View Details
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserOrder;
