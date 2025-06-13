import React, { useState, useEffect, useContext } from "react";
import { CurrentUserContext } from "../App";

/**
 * ProfileForm: pre-fills user info, allows editing and saving profile.
 * Props:
 * - saveProfile: async function (username, data) => updatedUser
 */
function ProfileForm({ saveProfile }) {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });
  const [formErrors, setFormErrors] = useState([]);
  const [saveConfirmed, setSaveConfirmed] = useState(false);

  // On mount & when currentUser changes, pre-fill form
  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        email: currentUser.email || "",
        password: ""
      });
    }
  }, [currentUser]);

  // Show loading until currentUser is available
  if (!currentUser) return <p>Loading...</p>;

  /** Handle form submit and save */
  async function handleSubmit(evt) {
    evt.preventDefault();
    const updateData = { ...formData };
    // If password is blank, remove it so backend won't overwrite
    if (!updateData.password) delete updateData.password;

    try {
      let updatedUser = await saveProfile(currentUser.username, updateData);
      setFormErrors([]);
      setSaveConfirmed(true);
      setCurrentUser(updatedUser);
      // clear password field
      setFormData(f => ({ ...f, password: "" }));
    } catch (errors) {
      setFormErrors(errors);
      setSaveConfirmed(false);
    }
  }

  /** Handle input changes */
  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData(data => ({ ...data, [name]: value }));
  }

  return (
    <div className="AuthForm">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit} noValidate>
        {formErrors.length > 0 && (
          <div className="AuthForm-errors">
            {formErrors.map((err, idx) => (
              <p key={idx} className="error">
                {err}
              </p>
            ))}
          </div>
        )}
        {saveConfirmed && <p className="success">Profile updated.</p>}

        <div>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            name="username"
            value={currentUser.username}
            disabled
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
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="password">New Password (leave blank to keep current):</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default ProfileForm;