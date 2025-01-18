import { pdf } from '@react-pdf/renderer';
import React from 'react';
import OrderInvoice from '../components/Invoice/OrderInvoice';
import toast from 'react-hot-toast';
import { getOrderForInvoice } from '../api/order/orderApi';

export const downloadInvoice = async (order) => {
  try {
    // Get complete order data with populated fields
    const completeOrder = await getOrderForInvoice(order.orderId);
    console.log('Complete order data:', completeOrder);
    
    const blob = await pdf(React.createElement(OrderInvoice, { order: completeOrder })).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice-${order.orderId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating invoice:', error);
    toast.error('Failed to generate invoice');
  }
};
