import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import JoblyApi from "./api";
import useLocalStorage from "./hooks/useLocalStorage";
import CompanyList from "./components/CompanyList";
import CompanyDetail from "./components/CompanyDetail";
import JobList from "./components/JobList";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import ProfileForm from "./components/ProfileForm";
import NotFound from "./components/NotFound";
import "./App.css";

// Contexts for current user and flash messages
export const CurrentUserContext = React.createContext();
export const FlashContext = React.createContext();

/**
 * Decode a JWT (no validation) to get its payload.
 */
function decodeToken(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

/**
 * FlashMessages: displays an array of flash messages with close buttons.
 */
function FlashMessages() {
  const { flashMessages, removeMessage } = useContext(FlashContext);
  return (
    <div className="FlashMessages">
      {flashMessages.map((msg, idx) => (
        <div key={idx} className="flash">
          {msg}
          <button onClick={() => removeMessage(idx)}>×</button>
        </div>
      ))}
    </div>
  );
}

/**
 * Protect routes so only logged-in users can access.
 */
function PrivateRoute({ children }) {
  const { currentUser } = useContext(CurrentUserContext);
  return currentUser ? children : <Navigate to="/login" replace />;
}

/**
 * NavBar: top navigation links, adjusts based on auth state
 */
function NavBar({ currentUser, logout }) {
  return (
    <nav className="NavBar">
      <div className="NavBar-group">
        <Link to="/">Home</Link>
        <Link to="/companies">Companies</Link>
        <Link to="/jobs">Jobs</Link>
      </div>
      <div className="NavBar-group">
        {currentUser ? (
          <>
            <Link to="/profile">Profile</Link>
            <button onClick={logout}>Log out</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}

/**
 * Home page: varies based on auth
 */
function Home({ currentUser }) {
  return (
    <div className="Home">
      {currentUser ? (
        <h2>Welcome back, {currentUser.firstName}!</h2>
      ) : (
        <h2>Welcome to Jobly! Please log in or sign up.</h2>
      )}
    </div>
  );
}

/**
 * Main App component
 */
function App() {
  // token synced with localStorage
  const [token, setToken] = useLocalStorage("joblyToken", "");
  const [currentUser, setCurrentUser] = useState(null);
  const [flashMessages, setFlashMessages] = useState([]);

  // Add or remove flash messages
  const addMessage = msg => setFlashMessages(msgs => [...msgs, msg]);
  const removeMessage = idx => setFlashMessages(msgs => msgs.filter((_, i) => i !== idx));

  // Handle login
  async function login(credentials) {
    try {
      const token = await JoblyApi.login(credentials);
      JoblyApi.token = token;
      setToken(token);
      addMessage("Welcome! You’ve successfully logged in.");
      return { success: true };
    } catch (errors) {
      return { success: false, errors };
    }
  }

  // Handle signup
  async function signup(data) {
    try {
      const token = await JoblyApi.register(data);
      JoblyApi.token = token;
      setToken(token);
      addMessage("Account created! Welcome aboard.");
      return { success: true };
    } catch (errors) {
      return { success: false, errors };
    }
  }

  // Handle logout
  function logout() {
    setCurrentUser(null);
    JoblyApi.token = "";
    setToken("");
    addMessage("You have logged out.");
  }

  // Load user when token changes
  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          JoblyApi.token = token;
          const payload = decodeToken(token);
          if (payload?.username) {
            const user = await JoblyApi.getCurrentUser(payload.username);
            setCurrentUser(user);
          }
        } catch (err) {
          console.error("Failed to load user:", err);
          setCurrentUser(null);
        }
      }
    }
    loadUser();
  }, [token]);

  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
      <FlashContext.Provider value={{ flashMessages, addMessage, removeMessage }}>
        <BrowserRouter>
          <NavBar currentUser={currentUser} logout={logout} />
          <FlashMessages />
          {currentUser && (
            <div className="UserBanner">
              Welcome, <strong>{currentUser.username}</strong>!
            </div>
          )}
          <div className="App">
            <Routes>
              <Route path="/" element={<Home currentUser={currentUser} />} />
              <Route path="/companies" element={<PrivateRoute><CompanyList addMessage={addMessage}/></PrivateRoute>} />
              <Route path="/companies/:handle" element={<PrivateRoute><CompanyDetail addMessage={addMessage}/></PrivateRoute>} />
              <Route path="/jobs" element={<PrivateRoute><JobList addMessage={addMessage}/></PrivateRoute>} />
              <Route path="/login" element={<LoginForm login={login} />} />
              <Route path="/signup" element={<SignupForm signup={signup} />} />
              <Route path="/profile" element={<PrivateRoute><ProfileForm saveProfile={(username, data) => JoblyApi.saveProfile(username, data)} /></PrivateRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </FlashContext.Provider>
    </CurrentUserContext.Provider>
  );
}

export default App;
