import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/inventory.css";
import Header from "../components/Header";

const Inventory = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await Axios.get("http://localhost:5000/api/products");
        setInventory(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load inventory data");
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const handleReserve = (id) => {
    alert(`Computer with ID ${id} reserved!`);
  };

  const handleDelete = (id) => {
    alert(`Computer with ID ${id} deleted (admin only)!`);
  };

  const handleEdit = (id) => {
    alert(`Edit form for ID ${id} (admin only)!`);
  };

  const matchesSearch = (item) => {
    const text = `${item.name} ${item.specs.cpu} ${
      item.specs.gpu
    } ${item.tags.join(" ")}`.toLowerCase();
    return text.includes(search.toLowerCase());
  };

  const filteredInventory = inventory.filter((item) => {
    return (filter === "All" || item.type === filter) && matchesSearch(item);
  });

  if (loading) {
    return <p>Loading inventory...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="inventory-container">
      <Header />
      <header className="inventory-header">
        <button
          className="admin-toggle-btn"
          onClick={() => {
            if (!isAdmin) {
              setIsAdmin(true);
              navigate("/admin/add-product");
            } else {
              setIsAdmin(false);
            }
          }}
        >
          Switch to {isAdmin ? "User" : "Admin"} Mode
        </button>
      </header>

      <div className="filter-search-bar">
        <div className="filter-buttons">
          {["All", "Desktop", "Laptop", "Server"].map((category) => (
            <button
              key={category}
              className={filter === category ? "active" : ""}
              onClick={() => setFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <input
          className="search-bar"
          type="text"
          placeholder="Search by name, spec, tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="inventory-grid">
        {filteredInventory.map((item) => (
          <div key={item._id} className="inventory-card">
            <img
              src={`http://localhost:5000${item.image}`}
              alt={item.name}
              className="inventory-img"
              onClick={() => setSelectedItem(item)}
            />
            <div className="inventory-info">
              <h3>{item.name}</h3>
              <ul>
                <li>
                  <strong>CPU:</strong> {item.specs.cpu}
                </li>
                <li>
                  <strong>RAM:</strong> {item.specs.ram}
                </li>
                <li>
                  <strong>Storage:</strong> {item.specs.storage}
                </li>
                <li>
                  <strong>GPU:</strong> {item.specs.gpu}
                </li>
                <li>
                  <strong>Price:</strong> M {item.price}
                </li>
              </ul>
              <div className="tag-container">
                {item.tags.map((tag, index) => (
                  <span key={`${tag}-${index}`} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="card-actions">
                <span className={`status ${item.status.toLowerCase()}`}>
                  {item.status}
                </span>
                <button onClick={() => handleReserve(item._id)}>Reserve</button>
                {isAdmin && (
                  <>
                    <button onClick={() => handleEdit(item._id)}>Edit</button>
                    <button onClick={() => handleDelete(item._id)}>
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedItem.name}</h2>
            <img
              src={`http://localhost:5000${selectedItem.image}`}
              alt={selectedItem.name}
            />
            <p>
              <strong>CPU:</strong> {selectedItem.specs.cpu}
            </p>
            <p>
              <strong>RAM:</strong> {selectedItem.specs.ram}
            </p>
            <p>
              <strong>Storage:</strong> {selectedItem.specs.storage}
            </p>
            <p>
              <strong>GPU:</strong> {selectedItem.specs.gpu}
            </p>
            <p>
              <strong>Price:</strong> M {selectedItem.price}
            </p>
            <p>
              <strong>Status:</strong> {selectedItem.status}
            </p>
            <button onClick={() => setSelectedItem(null)}>Close</button>
          </div>
        </div>
      )}

      <footer className="inventory-footer">
        <p>&copy; 2025 IWB Technologies. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Inventory;
