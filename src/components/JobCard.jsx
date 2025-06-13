import React, { useContext } from "react";
import JoblyApi from "../api";
import { CurrentUserContext, FlashContext } from "../App";


/**
 * Presentational card for a single job, with application button
 * Props:
 * - job: { id, title, salary, equity, companyName }
 */
function JobCard({ job }) {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const { addMessage } = useContext(FlashContext);

  // Determine if the user has applied to this job
  const applied = currentUser?.jobs?.some(j => j.id === job.id);

  async function handleApply() {
    try {
      await JoblyApi.applyToJob(currentUser.username, job.id);
      // Re-fetch the user so currentUser.jobs includes this job
      const updatedUser = await JoblyApi.getCurrentUser(currentUser.username);
      setCurrentUser(updatedUser);
      addMessage(`Applied to ${job.title}!`);
    } catch (err) {
      console.error("Error applying to job:", err);
      addMessage("Error applying to job.");
    }
  }

  return (
    <div className="JobCard">
      <h4 className="JobCard-title">{job.title}</h4>
      <small className="JobCard-company">Company: {job.companyName}</small>
      {job.salary != null && (
        <div className="JobCard-salary">Salary: ${job.salary.toLocaleString()}</div>
      )}
      {job.equity != null && job.equity > 0 && (
        <div className="JobCard-equity">Equity: {job.equity}</div>
      )}

      {currentUser && (
        <button
          className="JobCard-apply-btn"
          onClick={handleApply}
          disabled={applied}
        >
          {applied ? "Applied!" : "Apply"}
        </button>
      )}
    </div>
  );
}

export default JobCard;