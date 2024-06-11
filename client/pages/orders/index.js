/* const OrderIndex = ({ orders }) => {
  return (
    <ul>
      {orders.map((order) => {
        return (
          <li key={order.id}>
            {order.ticket.title} - {order.status}
          </li>
        );
      })}
    </ul>
  );
};

OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/orders');

  return { orders: data };
};

export default OrderIndex;
 */
import React from 'react';
import axios from 'axios';

const OrderIndex = ({ orders }) => {
  return (
    <div>
      <h1>Orders</h1>
      <ul>
        {orders.map(order => (
          <li key={order.id}>{order.status} - {order.ticket.title}</li>
        ))}
      </ul>
    </div>
  );
};

OrderIndex.getInitialProps = async (context, client) => {
  try {
    const { data } = await client.get('/api/orders');
    return { orders: data };
  } catch (err) {
    console.error('Error fetching orders:', err);
    return { orders: [] };
  }
};

export default OrderIndex;
