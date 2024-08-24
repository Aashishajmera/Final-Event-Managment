import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Swal from "sweetalert2";
import './Signup.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome

export default function SignIn() {

  // FOR GETTING THE URL 
  const signinURL = process.env.REACT_APP_SIGNIN_URL;


  // State for form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility

  // State for error messages
  const [emailErr, setEmailErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");

  // Hook for navigation
  const navigate = useNavigate();

  // Validation functions
  const validateEmail = (value) => {
    if (!value) {
      setEmailErr("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      setEmailErr("Email is invalid");
    } else {
      setEmailErr("");
    }
  };

  const validatePassword = (value) => {
    if (!value) {
      setPasswordErr("Password is required");
    } else if (value.length < 6) {
      setPasswordErr("Password must be at least 6 characters");
    } else {
      setPasswordErr("");
    }
  };

  // Handlers for input changes
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Run validations before submission
    validateEmail(email);
    validatePassword(password);

    // Check if there are any errors
    if (emailErr || passwordErr) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fix the errors in the form before submitting.",
      });
      return;
    }

    try {
      const response = await axios.post(
        signinURL,
        { email, password }
      );

      // Store user data in session storage
      const user = response.data.user;
      sessionStorage.setItem("user", JSON.stringify(user));

      if (response.status === 200) {
        // Notify the user of successful sign-in
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: response.data.msg || "Sign-In successful!",
          confirmButtonText: "OK",
        }).then(() => {
          // Navigate to the home page after success
          navigate("/homePage");
        });
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.msg || "Sign-In failed. Please try again.",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <>
      <main className="main-container d-flex align-items-center justify-content-center">
        <div className="input-container p-4 m-3">
          <div className="text-center mb-3">
            <h3 className="fw-bolder">SignIn</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="floatingInput"
                name="email"
                placeholder="name@example.com"
                value={email}
                onChange={handleEmailChange}
              />
              <label htmlFor="floatingInput">Email address</label>
              <small className="text-danger fs-7">{emailErr}</small>
            </div>
            <div className="form-floating mb-3 position-relative">
              <input
                type={passwordVisible ? 'text' : 'password'} // Toggle password visibility
                className="form-control"
                id="floatingPassword"
                name="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
              />
              <label htmlFor="floatingPassword">Password</label>
              <small className="text-danger fs-7">{passwordErr}</small>
              <i
                className={`fas fa-eye${passwordVisible ? '-slash' : ''}`} // Font Awesome icon
                onClick={() => setPasswordVisible(!passwordVisible)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  zIndex: 1,
                }}
              ></i>
            </div>
            <div className="mt-3">
              <button type="submit" className="btn btn-outline-success me-2">
                SignIn
              </button>
              <Link to="/">Create a new account</Link>
            </div>
          </form>
        </div>
      </main>
      <ToastContainer />
    </>
  );
}
