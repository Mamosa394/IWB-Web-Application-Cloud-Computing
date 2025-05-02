import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/SalesDashboard.css';
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, CategoryScale, LinearScale, PointElement, Filler } from 'chart.js';

// Important: Register Chart.js components and Filler plugin for 'fill' functionality
Chart.register(LineElement, CategoryScale, LinearScale, PointElement, Filler);

const SalesDashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  // State for new sale form
  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [salesperson, setSalesperson] = useState('');
  const [status, setStatus] = useState('pending');
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [saleType, setSaleType] = useState('online');

  // State for showing the sale that was just added
  const [newSale, setNewSale] = useState(null);

  // Prepare chart data
  const prepareChartData = (data) => {
    const dates = data.map((sale) => sale.date.slice(0, 10)); // Only YYYY-MM-DD
    const amounts = data.map((sale) => sale.amount);

    setChartData({
      labels: dates,
      datasets: [
        {
          label: 'Sales Over Time',
          data: amounts,
          fill: true,
          backgroundColor: 'rgba(251, 186, 63, 0.2)', // slightly transparent
          borderColor: '#fbba3f',
          tension: 0.3, // smoother lines
          pointBackgroundColor: '#ffd873',
          pointBorderColor: '#fbba3f',
        },
      ],
    });
  };

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/sales");
        setSalesData(response.data);
        prepareChartData(response.data);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    fetchSalesData();
  }, []);

  // Handle adding new sale
  const handleAddSale = async (e) => {
    e.preventDefault();

    const newSaleObj = {
      date: new Date().toISOString(),
      product,
      amount: parseFloat(amount),
      salesperson,
      status,
      paymentMethod,
      saleType,
    };

    try {
      await axios.post('http://localhost:5000/api/sales', newSaleObj);
      // Refresh sales data after adding new sale
      const response = await axios.get("http://localhost:5000/api/sales");
      setSalesData(response.data);
      prepareChartData(response.data);

      // Set the new sale to be displayed
      setNewSale(newSaleObj);

      // Clear form fields after submitting
      setProduct('');
      setAmount('');
      setSalesperson('');
      setStatus('pending');
      setPaymentMethod('credit');
      setSaleType('online');
    } catch (error) {
      console.error('Error adding new sale:', error);
    }
  };

  // Handle updating a sale
  const handleUpdateSale = async (id) => {
    const updatedSale = {
      date: new Date().toISOString(),
      product: 'Updated Product', // You can customize this
      amount: 100, // Updated amount
      salesperson: 'Updated Salesperson', // Updated salesperson
      status: 'completed', // Updated status
      paymentMethod: 'cash', // Updated payment method
      saleType: 'offline', // Updated sale type
    };

    try {
      const response = await axios.put(`http://localhost:5000/api/sales/${id}`, updatedSale);
      const updatedSalesData = salesData.map((sale) =>
        sale._id === id ? response.data : sale
      );
      setSalesData(updatedSalesData);
      prepareChartData(updatedSalesData);
    } catch (error) {
      console.error('Error updating sale:', error);
    }
  };

  // Handle deleting a sale
  const handleDeleteSale = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/sales/${id}`);
      const updatedSalesData = salesData.filter((sale) => sale._id !== id);
      setSalesData(updatedSalesData);
      prepareChartData(updatedSalesData);
    } catch (error) {
      console.error('Error deleting sale:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Sales Dashboard</h1>

      {/* Add New Sale Form */}
      <div className="add-sale-form">
        <h2>Add New Sale</h2>
        <form onSubmit={handleAddSale}>
          <input
            type="text"
            placeholder="Product"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Salesperson"
            value={salesperson}
            onChange={(e) => setSalesperson(e.target.value)}
            required
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
          >
            <option value="credit">Credit</option>
            <option value="cash">Cash</option>
            <option value="mpesa">Mpesa</option>
            <option value="ecocash">Ecocash</option>
          </select>
          <select
            value={saleType}
            onChange={(e) => setSaleType(e.target.value)}
            required
          >
            <option value="online">Online</option>
            <option value="in-store">In-Store</option>
          </select>
          <button type="submit">Add Sale</button>
        </form>
      </div>

      {/* Show the newly added sale after submitting */}
      {newSale && (
        <div className="new-sale-view">
          <h2>New Sale Added</h2>
          <p><strong>Product:</strong> {newSale.product}</p>
          <p><strong>Amount:</strong> ${newSale.amount}</p>
          <p><strong>Salesperson:</strong> {newSale.salesperson}</p>
          <p><strong>Date:</strong> {newSale.date.slice(0, 10)}</p>
        </div>
      )}

      {/* Display Sales Chart */}
      <div className="chart-section">
        {chartData.labels.length > 0 ? (
          <Line data={chartData} />
        ) : (
          <p>Loading chart...</p>
        )}
      </div>

      {/* Display Sales Table */}
      <div className="sales-table">
        <h2>Recent Sales</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Product</th>
              <th>Amount</th>
              <th>Salesperson</th>
              <th>Status</th>
              <th>Payment Method</th>
              <th>Sale Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {salesData.length > 0 ? (
              salesData.map((sale) => (
                <tr key={sale._id}>
                  <td>{sale.date.slice(0, 10)}</td>
                  <td>{sale.product}</td>
                  <td>${sale.amount}</td>
                  <td>{sale.salesperson}</td>
                  <td>{sale.status}</td>
                  <td>{sale.paymentMethod}</td>
                  <td>{sale.saleType}</td>
                  <td>
                    <button onClick={() => handleUpdateSale(sale._id)}>Update</button>
                    <button onClick={() => handleDeleteSale(sale._id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center' }}>No sales data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesDashboard;
