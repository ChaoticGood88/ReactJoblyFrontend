import React, { useState, useEffect } from "react";
import JoblyApi from "../api";
import CompanyCard from "./CompanyCard";


function CompanyList() {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  async function fetchCompanies(name = "") {
    setLoading(true);
    try {
      const companies = await JoblyApi.getCompanies({ name });
      setCompanies(companies);
    } catch (err) {
      console.error("Error fetching companies:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    fetchCompanies(searchTerm);
  }

  return (
    <div className="CompanyList">
      <h2>Companies</h2>
      <form onSubmit={handleSubmit} className="CompanyList-form">
        <input
          type="text"
          placeholder="Search companies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button>Search</button>
      </form>
      {loading ? (
        <p>Loading...</p>
      ) : companies.length ? (
        companies.map((c) => <CompanyCard key={c.handle} company={c} />)
      ) : (
        <p>No companies found.</p>
      )}
    </div>
  );
}

export default CompanyList;