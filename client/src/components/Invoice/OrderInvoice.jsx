import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';
import logo from '../../assets/images/logo/Infinora-black.png';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 50,
    objectFit: 'contain',
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a237e',
  },
  section: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  column: {
    flex: 1,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 4,
  },
  value: {
    fontSize: 11,
    color: '#000000',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 10,
    paddingBottom: 5,
    borderBottom: 1,
    borderBottomColor: '#e0e0e0',
  },
  table: {
    display: 'table',
    width: '100%',
    marginVertical: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 8,
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
    textAlign: 'center',
  },
  tableCellWide: {
    flex: 2,
    fontSize: 10,
    paddingLeft: 8,
  },
  total: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 4,
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'right',
    paddingRight: 20,
  },
  totalValue: {
    fontSize: 11,
    fontWeight: 'bold',
    width: 100,
    textAlign: 'right',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#666666',
    fontSize: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
});

const OrderInvoice = ({ order }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
    const formattedAmount = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
    return `Rs. ${formattedAmount}`;
  };

  if (!order || !order.product || !order.user || !order.vendor) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>Invalid Order Data</Text>
          </View>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Image style={styles.logo} src={logo} />
          </View>
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.value}>#{order.orderId}</Text>
            <Text style={styles.label}>Date: {formatDate(order.createdAt)}</Text>
          </View>
        </View>

        {/* Billing and Shipping Info */}
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Billing Information</Text>
            <Text style={styles.label}>Customer Name</Text>
            <Text style={styles.value}>{order.user.name}</Text>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{order.user.email}</Text>
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.value}>{order.user.phoneNumber}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Shipping Information</Text>
            <Text style={styles.label}>Address</Text>
            <Text style={styles.value}>
              {order.shippingAddress.address},
            </Text>
            <Text style={styles.value}>
              {order.shippingAddress.locality},
            </Text>
            <Text style={styles.value}>
              {order.shippingAddress.state} - {order.shippingAddress.pincode}
            </Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Vendor Information</Text>
            <Text style={styles.label}>Vendor Name</Text>
            <Text style={styles.value}>{order.vendor.name}</Text>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{order.vendor.email}</Text>
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.value}>{order.vendor.phoneNumber}</Text>
          </View>
        </View>

        {/* Order Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Details</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCellWide}>Product</Text>
              <Text style={styles.tableCell}>Variant</Text>
              <Text style={styles.tableCell}>Quantity</Text>
              <Text style={styles.tableCell}>Price</Text>
              <Text style={styles.tableCell}>Total</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellWide}>{order.product.name}</Text>
              <Text style={styles.tableCell}>
                {order.variants
                  ? Object.entries(order.variants)
                      .map(([key, value]) => `${key}: ${value}`)
                      .join(', ')
                  : 'N/A'}
              </Text>
              <Text style={styles.tableCell}>{order.quantity}</Text>
              <Text style={styles.tableCell}>
                {formatCurrency(order.product.price)}
              </Text>
              <Text style={styles.tableCell}>
                {formatCurrency(order.product.price * order.quantity)}
              </Text>
            </View>
          </View>

          {/* Totals */}
          <View style={styles.total}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal:</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(order.product.price * order.quantity)}
              </Text>
            </View>
            {order.discount > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Discount:</Text>
                <Text style={styles.totalValue}>
                  - {formatCurrency((order.price * order.quantity * order.discount) / 100)}
                </Text>
              </View>
            )}
            {order.appliedCoupon && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Coupon Discount:</Text>
                <Text style={styles.totalValue}>
                  - {formatCurrency(order.appliedCoupon.couponDiscount)}
                </Text>
              </View>
            )}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount:</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(order.finalAmount)}
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Information</Text>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Payment Method</Text>
              <Text style={styles.value}>{order.paymentMethod}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Payment Status</Text>
              <Text style={styles.value}>{order.paymentStatus}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Order Status</Text>
              <Text style={styles.value}>{order.status}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Thank you for shopping with Infinora!</Text>
          <Text>For any queries, please contact support@infinora.com</Text>
        </View>
      </Page>
    </Document>
  );
};

export default OrderInvoice;
