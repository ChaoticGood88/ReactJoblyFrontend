import React, { useState, useEffect } from "react";
import JoblyApi from "../api";
import JobCard from "./JobCard";


/**
 * Fetches and displays a list of jobs with server-side filtering
 */
function JobList() {
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [hasEquity, setHasEquity] = useState(false);
  const [loading, setLoading] = useState(true);

  // initial load of all jobs
  useEffect(() => {
    fetchJobs({});
  }, []);

  async function fetchJobs(filters) {
    setLoading(true);
    try {
      // build filter object for API
      const data = {};
      if (filters.title) data.title = filters.title;
      if (filters.minSalary) data.minSalary = +filters.minSalary;
      if (filters.hasEquity) data.hasEquity = true;

      const jobsRes = await JoblyApi.getJobs(data);
      setJobs(jobsRes);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    fetchJobs({ title, minSalary, hasEquity });
  }

  return (
    <div className="JobList">
      <h2>Jobs</h2>
      <form onSubmit={handleSubmit} className="JobList-form">
        <input
          type="text"
          placeholder="Job title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="number"
          placeholder="Min Salary"
          value={minSalary}
          onChange={(e) => setMinSalary(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={hasEquity}
            onChange={(e) => setHasEquity(e.target.checked)}
          />
          Only show jobs with equity
        </label>
        <button>Search</button>
      </form>

      {loading ? (
        <p>Loading…</p>
      ) : jobs.length ? (
        jobs.map((j) => <JobCard key={j.id} job={j} />)
      ) : (
        <p>No jobs found.</p>
      )}
    </div>
  );
}

export default JobList;
