import axios from "axios";

// Vite exposes env vars via import.meta.env
// Ensure you have a .env file at project root with:
// VITE_BASE_URL="http://localhost:3001"
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3001";

/**
 * API Class.
 *
 * Static class tying together methods used to get/send to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 */
class JoblyApi {
  // token for interacting with the API will be stored here.
  static token;

  /**
   * Make API request.
   *
   * @param {string} endpoint - API endpoint (e.g., "companies/1").
   * @param {*} data - Data for POST/PATCH or query params for GET.
   * @param {string} method - HTTP method ("get", "post", "patch", "delete").
   * @returns {object} - Response data.
   * @throws {array<string>} - Array of error messages.
   */
  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${JoblyApi.token}` };
    const params = method === "get" ? data : {};

    try {
      const response = await axios({ url, method, data, params, headers });
      return response.data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response?.data?.error?.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // ********************** Auth Routes ********************** //

  /** Login: POST /auth/token => { token } */
  static async login(data) {
    const res = await this.request("auth/token", data, "post");
    return res.token;
  }

  /** Register: POST /auth/register => { token } */
  static async register(data) {
    const res = await this.request("auth/register", data, "post");
    return res.token;
  }

  // ********************** User Routes ********************** //

  /** Get current user: GET /users/:username => { user } */
  static async getCurrentUser(username) {
    const res = await this.request(`users/${username}`);
    return res.user;
  }

  /** Save profile edits: PATCH /users/:username => { user } */
  static async saveProfile(username, data) {
    const res = await this.request(`users/${username}`, data, "patch");
    return res.user;
  }

  // ********************** Company Routes ********************** //

  /** Get all companies: GET /companies => { companies: [...] } */
  static async getCompanies(filters = {}) {
    const res = await this.request("companies", filters);
    return res.companies;
  }

  /** Get company details: GET /companies/:handle => { company } */
  static async getCompany(handle) {
    const res = await this.request(`companies/${handle}`);
    return res.company;
  }

  // ********************** Job Routes ********************** //

  /** Get all jobs: GET /jobs => { jobs: [...] } */
  static async getJobs(filters = {}) {
    const res = await this.request("jobs", filters);
    return res.jobs;
  }

  /** Get job details: GET /jobs/:id => { job } */
  static async getJob(id) {
    const res = await this.request(`jobs/${id}`);
    return res.job;
  }

  /** Apply to job: POST /users/:username/jobs/:id => { applied: jobId } */
  static async applyToJob(username, id) {
    const res = await this.request(`users/${username}/jobs/${id}`, {}, "post");
    return res;
  }
}

// Hard-coded token for initial testing (“testuser”)
JoblyApi.token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3R1c2VyIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU5ODE1OTI1OX0.FtrMwBQwe6Ue-glIFgz_Nf8XxRT2YecFCiSpYL0fCXc";

export default JoblyApi;