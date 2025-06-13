import React from "react";
import { Link } from "react-router-dom";


function CompanyCard({ company }) {
  const { handle, name, description, numEmployees, logoUrl } = company;
  return (
    <div className="CompanyCard">
      {logoUrl && (
        <img
          src={logoUrl}
          alt={`${name} logo`}
          className="CompanyCard-logo"
        />
      )}
      <div className="CompanyCard-info">
        <h3>
          <Link to={`/companies/${handle}`}>{name}</Link>
        </h3>
        <p>Employees: {numEmployees ?? "N/A"}</p>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default CompanyCard;