import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import JoblyApi from "../api";
import JobCard from "./JobCard";

function CompanyDetail() {
  const { handle } = useParams();
  const [company, setCompany] = useState(null);

  useEffect(() => {
    async function fetchCompany() {
      let c = await JoblyApi.getCompany(handle);
      setCompany(c);
    }
    fetchCompany();
  }, [handle]);

  if (!company) return <p>Loading…</p>;

  return (
    <div className="CompanyDetail">
      <h2>{company.name}</h2>
      {company.logoUrl && <img src={company.logoUrl} alt={`${company.name} logo`} />}
      <p>{company.description}</p>
      <p><strong>Employees:</strong> {company.numEmployees}</p>

      <h3>Jobs at {company.name}</h3>
      {company.jobs.length
        ? company.jobs.map(j => <JobCard key={j.id} job={j} />)
        : <p>No jobs available.</p>
      }
    </div>
  );
}

export default CompanyDetail;