import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import '../styles/query.css'; 

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const QueryForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [queries, setQueries] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/client-queries');
      const data = await res.json();
      setQueries(data);
    } catch (err) {
      console.error('Error fetching queries:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage('Submitting...');

    try {
      const res = await fetch('http://localhost:5000/api/client-queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      setStatusMessage(`Query submitted: Status - ${result.status}`);
      setFormData({ name: '', email: '', message: '' });
      fetchQueries();
    } catch (err) {
      console.error('Submission error:', err);
      setStatusMessage('Submission failed.');
    }
  };

  const countByStatus = (status) =>
    queries.filter((query) => query.status === status).length;

  const chartData = {
    labels: ['Pending', 'Complete'],
    datasets: [
      {
        label: 'Number of Queries',
        data: [countByStatus('pending'), countByStatus('complete')],
        backgroundColor: ['#FF6347', '#83C760'],
      },
    ],
  };

  const handleRowSelect = (id) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((rowId) => rowId !== id)
        : [...prevSelected, id]
    );
  };

  const isRowSelected = (id) => selectedRows.includes(id);

  return (
    <div className="query-container">
      <h2 className="query-title">Client Support</h2>

      <form onSubmit={handleSubmit} className="query-form">
        <input
          className="form-input"
          type="text"
          placeholder="Name"
          value={formData.name}
          required
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          className="form-input"
          type="email"
          placeholder="Email"
          value={formData.email}
          required
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <textarea
          className="form-textarea"
          placeholder="Your message"
          value={formData.message}
          required
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        />
        <button type="submit" className="form-button">Submit</button>
        <p className="status-message">{statusMessage}</p>
      </form>

      <h3 className="query-subtitle">Query Statistics</h3>
      <div className="chart-container">
        <Bar data={chartData} />
      </div>

      <h3 className="query-subtitle">Query List</h3>
      <div className="table-wrapper">
        <table className="query-table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Status</th>
              <th>Message</th>
              <th>Auto-Reply</th>
            </tr>
          </thead>
          <tbody>
            {queries.map((q) => (
              <tr
                key={q._id}
                className={`table-row ${isRowSelected(q._id) ? 'selected' : ''}`}
                onClick={() => handleRowSelect(q._id)}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={isRowSelected(q._id)}
                    onChange={() => handleRowSelect(q._id)}
                  />
                </td>
                <td>{q.name}</td>
                <td className={q.status === 'complete' ? 'status-complete' : 'status-pending'}>
                  {q.status}
                </td>
                <td>{q.message}</td>
                <td className={q.status === 'pending' ? 'reply-pending' : 'reply-complete'}>
                  {q.autoReply}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QueryForm;
