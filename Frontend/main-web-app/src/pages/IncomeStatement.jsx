import React, { useState, useEffect } from "react";
import { Chart } from "react-chartjs-2";
import "../styles/incomeStatement.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";

// Initialize Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement, // Register PieElement as ArcElement for Pie chart
  Title,
  Tooltip,
  Legend
);

// Utility functions for localStorage (if needed for fallback)
const saveDataToLocalStorage = (month, data) => {
  localStorage.setItem(`incomeData-${month}`, JSON.stringify(data));
};

const loadDataFromLocalStorage = (month) => {
  const data = localStorage.getItem(`incomeData-${month}`);
  return data ? JSON.parse(data) : null;
};

// Define the loadUserProfile function here
const loadUserProfile = () => {
  const profile = localStorage.getItem("userProfile");
  return profile ? JSON.parse(profile) : { name: "", email: "" }; // Default user data
};

const IncomeStatement = () => {
  const [month, setMonth] = useState("April 2025");
  const [userData, setUserData] = useState(loadUserProfile()); // Load initial user data from localStorage
  const [data, setData] = useState(
    loadDataFromLocalStorage(month) || {
      revenue: 0,
      costOfGoodsSold: 0,
      operatingExpenses: 0,
      taxes: 0,
      additionalCategories: [],
    }
  );

  // Function to load user profile data (from API or local storage)
  const loadUserProfileFromAPI = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/user/${userData.email}`
      );
      setUserData(response.data); // Assuming the response has the user data
      localStorage.setItem("userProfile", JSON.stringify(response.data)); // Save to localStorage
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  };

  useEffect(() => {
    if (userData.email) {
      loadUserProfileFromAPI(); // Fetch user profile from API if email exists
    }
  }, [userData.email]); // Trigger API call whenever the email changes

  const handleChange = (key, value) => {
    setData({ ...data, [key]: Number(value) || 0 });
  };

  const handleCategoryChange = (index, key, value) => {
    const updatedCategories = [...data.additionalCategories];
    updatedCategories[index][key] = value;
    setData({ ...data, additionalCategories: updatedCategories });
  };

  const addCategory = () => {
    setData({
      ...data,
      additionalCategories: [
        ...data.additionalCategories,
        { label: "", amount: 0 },
      ],
    });
  };

  const removeCategory = (index) => {
    const updatedCategories = data.additionalCategories.filter(
      (_, i) => i !== index
    );
    setData({ ...data, additionalCategories: updatedCategories });
  };

  const saveUserProfile = () => {
    localStorage.setItem("userProfile", JSON.stringify(userData));
  };

  useEffect(() => {
    saveDataToLocalStorage(month, data);
  }, [month, data]);

  const grossProfit = data.revenue - data.costOfGoodsSold;
  const netIncome = grossProfit - data.operatingExpenses - data.taxes;
  const totalAdditionalExpenses = data.additionalCategories.reduce(
    (sum, category) => sum + Number(category.amount),
    0
  );
  const finalNetIncome = netIncome - totalAdditionalExpenses;

  const months = [
    "January 2025",
    "February 2025",
    "March 2025",
    "April 2025",
    "May 2025",
    "June 2025",
    "July 2025",
    "August 2025",
    "September 2025",
    "October 2025",
    "November 2025",
    "December 2025",
  ];

  const chartData = {
    labels: months,
    datasets: [
      {
        label: "Net Income",
        data: months.map(() => Math.floor(Math.random() * 5000) - 2500), // Random data for visualization
        backgroundColor: "#6ee7b7", // Green
        borderColor: "#34d399",
        borderWidth: 1,
      },
      {
        label: "Expenses",
        data: months.map(() => Math.floor(Math.random() * 1000)), // Random expenses for visualization
        backgroundColor: "#ff4d4d", // Red
        borderColor: "#e02424",
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: ["Revenue", "Cost of Goods Sold", "Expenses", "Taxes"],
    datasets: [
      {
        data: [
          data.revenue,
          data.costOfGoodsSold,
          data.operatingExpenses,
          data.taxes,
        ],
        backgroundColor: ["#34d399", "#6ee7b7", "#ff4d4d", "#e02424"],
        borderColor: ["#34d399", "#6ee7b7", "#ff4d4d", "#e02424"],
        borderWidth: 1,
      },
    ],
  };

  const averageIncome =
    (data.revenue +
      data.costOfGoodsSold +
      data.operatingExpenses +
      data.taxes) /
    4;

  return (
    <div className="income-statement-page" style={{ display: "flex" }}>
      <AdminSidebar />
      <div className="income-statement-container">
        <h1 className="income-statement-title">
          Projected Monthly Income Statement
        </h1>

        {/* Main Section: User Profile (left) and Income Statement (right) */}
        <div className="main-section">
          {/* User Profile Section (Left) */}
          <div className="user-profile">
            <h2 className="user-profile-title">User Profile</h2>
            <div className="user-profile-item">
              <span className="user-profile-label">Name</span>
              <input
                type="text"
                value={userData.name}
                onChange={(e) =>
                  setUserData({ ...userData, name: e.target.value })
                }
                onBlur={saveUserProfile}
                className="user-profile-input"
              />
            </div>
            <div className="user-profile-item">
              <span className="user-profile-label">Email</span>
              <input
                type="email"
                value={userData.email}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
                onBlur={saveUserProfile}
                className="user-profile-input"
              />
            </div>
          </div>

          {/* Income Statement Section (Right) */}
          <div className="income-input-container">
            {/* Editable Rows */}
            <div className="income-statement-item">
              <span className="income-label">Revenue</span>
              <input
                type="number"
                value={data.revenue}
                onChange={(e) => handleChange("revenue", e.target.value)}
                className="income-statement-input"
              />
            </div>
            <div className="income-statement-item">
              <span className="income-label">Cost of Goods Sold</span>
              <input
                type="number"
                value={data.costOfGoodsSold}
                onChange={(e) =>
                  handleChange("costOfGoodsSold", e.target.value)
                }
                className="income-statement-input"
              />
            </div>
            <div className="income-statement-item">
              <span className="income-label">Operating Expenses</span>
              <input
                type="number"
                value={data.operatingExpenses}
                onChange={(e) =>
                  handleChange("operatingExpenses", e.target.value)
                }
                className="income-statement-input"
              />
            </div>
            <div className="income-statement-item">
              <span className="income-label">Taxes</span>
              <input
                type="number"
                value={data.taxes}
                onChange={(e) => handleChange("taxes", e.target.value)}
                className="income-statement-input"
              />
            </div>

            {/* Additional Categories */}
            {data.additionalCategories.map((category, index) => (
              <div key={index} className="income-statement-category">
                <input
                  type="text"
                  value={category.label}
                  onChange={(e) =>
                    handleCategoryChange(index, "label", e.target.value)
                  }
                  placeholder="Category Name"
                  className="category-input"
                />
                <input
                  type="number"
                  value={category.amount}
                  onChange={(e) =>
                    handleCategoryChange(index, "amount", e.target.value)
                  }
                  placeholder="Amount"
                  className="category-input"
                />
                <button
                  onClick={() => removeCategory(index)}
                  className="remove-category-btn"
                >
                  Remove
                </button>
              </div>
            ))}
            <button onClick={addCategory} className="add-category-btn">
              Add Category
            </button>
          </div>
        </div>

        {/* Net Income and Chart Section */}
        <div className="chart-section">
          <p className="net-income">
            Net Income: M {finalNetIncome.toFixed(2)}
          </p>
          <div className="chart-container">
            <div className="chart-item">
              <Chart type="bar" data={chartData} />
            </div>
            <div className="chart-item">
              <Chart type="pie" data={pieChartData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeStatement;
