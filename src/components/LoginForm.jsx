import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


/**
 * Renders login form and calls login prop on submit.
 * Props:
 * - login: async function({ username, password }) => { success, errors }
 */
function LoginForm({ login }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [formErrors, setFormErrors] = useState([]);

  /** Handle form submit */
  async function handleSubmit(evt) {
    evt.preventDefault();
    const { success, errors } = await login(formData);
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
      <h2>Log In</h2>
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
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default LoginForm;