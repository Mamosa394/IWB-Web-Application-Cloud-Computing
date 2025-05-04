import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import "../styles/query.css";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const QueryForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [queries, setQueries] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/client-queries");
      const data = await res.json();
      setQueries(data);
    } catch (err) {
      console.error("Error fetching queries:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage("Submitting...");

    try {
      const res = await fetch("http://localhost:5000/api/client-queries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      setStatusMessage(`Query submitted: Status - ${result.status}`);
      setFormData({ name: "", email: "", message: "" });
      fetchQueries();
    } catch (err) {
      console.error("Submission error:", err);
      setStatusMessage("Submission failed.");
    }
  };

  const countByStatus = (status) =>
    queries.filter((query) => query.status === status).length;

  const markAsComplete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/client-queries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "complete" }),
      });
      fetchQueries();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const chartData = {
    labels: ["Pending", "Complete"],
    datasets: [
      {
        label: "Number of Queries",
        data: [countByStatus("pending"), countByStatus("complete")],
        backgroundColor: ["#fbba3f", "#83C760"],
      },
    ],
  };

  return (
    <div className="query-container">
      <h2 className="query-title">Client Query Submission</h2>

      <form onSubmit={handleSubmit} className="query-form">
        <input
          className="queryinput"
          type="text"
          placeholder="Name"
          value={formData.name}
          required
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          className="queryinput"
          type="email"
          placeholder="Email"
          value={formData.email}
          required
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <textarea
          className="queryinput"
          placeholder="Your message"
          value={formData.message}
          required
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
        />
        <button className="submit-button" type="submit">
          Submit
        </button>
        <p className="status-message">{statusMessage}</p>
      </form>

      <h3 className="query-title">Query Stats</h3>
      <div className="chart-container">
        <Bar data={chartData} />
      </div>

      <h3 className="query-title">All Queries</h3>
      <div className="query-table-container">
        <table className="query-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Message</th>
              <th>Auto-Reply</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {queries.map((q) => (
              <tr key={q._id}>
                <td>{q.name}</td>
                <td
                  style={{
                    color: q.status === "complete" ? "#83C760" : "#fbba3f",
                  }}
                >
                  {q.status}
                </td>
                <td>{q.message}</td>
                <td
                  style={{ color: q.status === "pending" ? "#ccc" : "#4ea217" }}
                >
                  {q.autoReply}
                </td>
                <td>
                  {q.status === "pending" && (
                    <button
                      onClick={() => markAsComplete(q._id)}
                      className="complete-button"
                    >
                      Mark Complete
                    </button>
                  )}
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
