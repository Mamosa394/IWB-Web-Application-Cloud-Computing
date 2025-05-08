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

  const [showBuyModal, setShowBuyModal] = useState(false); 
  const [buyItem, setBuyItem] = useState(null);

  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await Axios.get(`${BASE_URL}/api/products`);
        setInventory(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load inventory data");
        setLoading(false);
      }
    };

    fetchInventory();
  }, [BASE_URL]);

  const handleDelete = (id) => {
    alert(`Item with ID ${id} deleted (admin only)!`);
  };

  const handleEdit = (id) => {
    alert(`Edit form for ID ${id} (admin only)!`);
  };

  const handleBuy = (item) => {
    setBuyItem(item);
    setShowBuyModal(true);
  };

  const handleCloseModal = () => {
    setShowBuyModal(false);
    setBuyItem(null);
  };

  const matchesSearch = (item) => {
    const text = `${item.name} ${item.specs.cpu} ${item.specs.gpu} ${item.tags.join(" ")}`.toLowerCase();
    return text.includes(search.toLowerCase());
  };

  const filteredInventory = inventory.filter((item) => {
    return (filter === "All" || item.type === filter) && matchesSearch(item);
  });

  if (loading) return <p>Loading inventory...</p>;
  if (error) return <p>{error}</p>;

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
              src={`${BASE_URL}${item.image}`}
              alt={item.name}
              className="inventory-img"
              onClick={() => setSelectedItem(item)}
            />
            <div className="inventory-info">
              <h3>{item.name}</h3>
              <ul>
                <li><strong>CPU:</strong> {item.specs.cpu}</li>
                <li><strong>RAM:</strong> {item.specs.ram}</li>
                <li><strong>Storage:</strong> {item.specs.storage}</li>
                <li><strong>GPU:</strong> {item.specs.gpu}</li>
                <li><strong>Price:</strong> M {item.price}</li>
              </ul>
              <div className="tag-container">
                {item.tags.map((tag, index) => (
                  <span key={`${tag}-${index}`} className="tag">{tag}</span>
                ))}
              </div>
              <div className="card-actions">
                <span className={`status ${item.status.toLowerCase()}`}>
                  {item.status}
                </span>
                {isAdmin && (
                  <>
                    <button onClick={() => handleEdit(item._id)}>Edit</button>
                    <button onClick={() => handleDelete(item._id)}>Delete</button>
                  </>
                )}
                <div className="buy-button" onClick={() => handleBuy(item)}>
                  Buy
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Buy Modal */}
      {showBuyModal && buyItem && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Confirm Purchase</h2>
            <img
              src={`${BASE_URL}${buyItem.image}`}
              alt={buyItem.name}
              className="modal-item-img"
            />
            <p><strong>Item:</strong> {buyItem.name}</p>
            <p><strong>CPU:</strong> {buyItem.specs.cpu}</p>
            <p><strong>RAM:</strong> {buyItem.specs.ram}</p>
            <p><strong>Storage:</strong> {buyItem.specs.storage}</p>
            <p><strong>GPU:</strong> {buyItem.specs.gpu}</p>
            <p><strong>Price:</strong> M {buyItem.price}</p>
            <div className="modal-actions">
              <button onClick={handleCloseModal}>Cancel</button>
              <button
                onClick={() => {
                  alert(`You bought ${buyItem.name} for M ${buyItem.price}!`);
                  handleCloseModal();
                }}
              >
                Confirm Purchase
              </button>
            </div>
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
