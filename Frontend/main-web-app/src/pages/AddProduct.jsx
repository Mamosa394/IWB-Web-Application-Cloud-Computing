import React, { useState } from "react";
import "../styles/add-product.css";
import Header from "../components/Header";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState("Desktop");
  const [cpu, setCpu] = useState("");
  const [ram, setRam] = useState("");
  const [storage, setStorage] = useState("");
  const [gpu, setGpu] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState("Available");
  const [tags, setTags] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleTagsChange = (e) => {
    setTags(e.target.value.split(",").map((tag) => tag.trim()));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
    } else {
      setError("Please upload a valid image file.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
    } else {
      setError("Please upload a valid image file.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setError("Please upload a product image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("type", type);
    formData.append("cpu", cpu);
    formData.append("ram", ram);
    formData.append("storage", storage);
    formData.append("gpu", gpu);
    formData.append("price", price);
    formData.append("status", status);
    formData.append("tags", tags);
    formData.append("image", image);

    try {
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error adding product");
      }

      const data = await response.json();
      setSuccess(true);
      alert("Product added successfully!");

      // Reset form
      setName("");
      setType("Desktop");
      setCpu("");
      setRam("");
      setStorage("");
      setGpu("");
      setPrice("");
      setImage(null);
      setTags("");

      console.log(data); // You can use 'data.image' here to display the uploaded image
    } catch (error) {
      setError(error.message);
      setSuccess(false);
    }
  };

  return (
    <div className="add-product-container">
      <Header />
      <div className="header">
        <h1>Add New Product</h1>
      </div>

      {error && <p className="error-message">{error}</p>}
      {success && (
        <p className="success-message">Product added successfully!</p>
      )}

      <div className="content">
        {/* Upload Section */}
        <div
          className="upload-section"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {image ? (
            <img
              src={URL.createObjectURL(image)} // Display the image before submitting
              alt="Product"
              className="image-preview"
            />
          ) : (
            <div className="upload-placeholder">
              <p>Drag & Drop image here</p>
              <span>or click to upload</span>
              <input
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                className="file-input"
              />
            </div>
          )}
        </div>

        {/* Form Section */}
        <div className="form-section">
          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="Desktop">Desktop</option>
                <option value="Laptop">Laptop</option>
                <option value="Server">Server</option>
              </select>
            </div>

            <div className="form-group">
              <label>CPU</label>
              <input
                type="text"
                value={cpu}
                onChange={(e) => setCpu(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>RAM</label>
              <input
                type="text"
                value={ram}
                onChange={(e) => setRam(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Storage</label>
              <input
                type="text"
                value={storage}
                onChange={(e) => setStorage(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>GPU</label>
              <input
                type="text"
                value={gpu}
                onChange={(e) => setGpu(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Price ($)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Available">Available</option>
                <option value="Recycled">Recycled</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>

            <div className="form-group">
              <label>Tags (comma separated)</label>
              <input
                type="text"
                value={tags}
                onChange={handleTagsChange}
                required
              />
            </div>

            <button type="submit" className="publish-button">
              Publish Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
