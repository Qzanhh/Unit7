"use client"

import { useState, useEffect } from "react"
import BreweryList from "./BreweryList"
import Statistics from "./Statistics"
import ChartComponent from "./ChartComponent"
import "../styles/Dashboard.css"

const Dashboard = () => {
  const [breweries, setBreweries] = useState([])
  const [filteredBreweries, setFilteredBreweries] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [breweryTypeFilter, setBreweryTypeFilter] = useState("all")
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBreweries = async () => {
      try {
        setLoading(true)
        // Fetch more than 10 to ensure we have enough after filtering
        const response = await fetch("https://api.openbrewerydb.org/v1/breweries?per_page=50")

        if (!response.ok) {
          throw new Error("Failed to fetch breweries")
        }

        const data = await response.json()
        setBreweries(data)
        setFilteredBreweries(data)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchBreweries()
  }, [])

  useEffect(() => {
    // Filter breweries based on search query and brewery type
    const filtered = breweries.filter((brewery) => {
      const matchesSearch = brewery.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = breweryTypeFilter === "all" || brewery.brewery_type === breweryTypeFilter
      return matchesSearch && matchesType
    })

    setFilteredBreweries(filtered)
  }, [searchQuery, breweryTypeFilter, breweries])

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleTypeFilterChange = (e) => {
    setBreweryTypeFilter(e.target.value)
  }

  // Get unique brewery types for the filter
  const breweryTypes = ["all", ...new Set(breweries.map((brewery) => brewery.brewery_type))].filter(Boolean)

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "white", // Set legend text color to white
        },
      },
      tooltip: {
        titleColor: "white", // Set tooltip title text color to white
        bodyColor: "white", // Set tooltip body text color to white
      },
    },
    scales: {
      x: {
        ticks: {
          color: "white", // Set x-axis text color to white
        },
      },
      y: {
        ticks: {
          color: "white", // Set y-axis text color to white
        },
      },
    },
  }

  const breweryTypeData = breweries.reduce((acc, brewery) => {
    const type = brewery.brewery_type || "Unknown"
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {})

  const breweryTypeChartData = {
    labels: Object.keys(breweryTypeData),
    datasets: [
      {
        label: "Brewery Types",
        data: Object.values(breweryTypeData),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
      },
    ],
  }

  const breweryStateData = breweries.reduce((acc, brewery) => {
    const state = brewery.state || "Unknown"
    acc[state] = (acc[state] || 0) + 1
    return acc
  }, {})

  const breweryStateChartData = {
    labels: Object.keys(breweryStateData),
    datasets: [
      {
        label: "Breweries by State",
        data: Object.values(breweryStateData),
        backgroundColor: "#36A2EB",
      },
    ],
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Brewery Dashboard</h1>
        <p className="dashboard-subtitle">Explore and discover breweries across the United States</p>
      </div>

      <div className="statistics-grid">
        <Statistics breweries={breweries} />
      </div>

      <div className="filter-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search breweries..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
        <div className="filter-select-container">
          <select value={breweryTypeFilter} onChange={handleTypeFilterChange} className="filter-select">
            {breweryTypes.map((type) => (
              <option key={type} value={type}>
                {type === "all" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="chart-container">
        <h2>Brewery Types</h2>
        <ChartComponent data={breweryTypeChartData} options={{ responsive: true }} />
      </div>
      <div className="chart-container">
        <h2>Breweries by State</h2>
        <ChartComponent data={breweryStateChartData} options={{ responsive: true }} />
      </div>

      {error ? (
        <div className="error-card">
          <p className="error-message">Error: {error}</p>
        </div>
      ) : (
        <BreweryList breweries={filteredBreweries} loading={loading} />
      )}
    </div>
  )
}

export default Dashboard

