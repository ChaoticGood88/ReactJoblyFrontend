import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


/**
 * Renders signup form and calls signup prop on submit.
 * Props:
 * - signup: async function({ username, password, firstName, lastName, email }) => { success, errors }
 */
function SignupForm({ signup }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: ""
  });
  const [formErrors, setFormErrors] = useState([]);

  /** Handle form submit */
  async function handleSubmit(evt) {
    evt.preventDefault();
    const { success, errors } = await signup(formData);
    if (success) {
      navigate("/");
    } else {
      setFormErrors(errors);
    }
  }

  /** Handle input change */
  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData(f => ({ ...f, [name]: value }));
  }

  return (
    <div className="AuthForm">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        {formErrors.length > 0 && (
          <div className="AuthForm-errors">
            {formErrors.map((err, idx) => (
              <p key={idx} className="error">
                {err}
              </p>
            ))}
          </div>
        )}
        <div>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="firstName">First Name:</label>
          <input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="lastName">Last Name:</label>
          <input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupForm;