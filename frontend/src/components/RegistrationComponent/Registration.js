import React, { useState, lazy, Suspense } from "react";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Registration.css";

// Lazy load HeaderComponent and FooterComponent
const FooterComponent = lazy(() => import("../FooterComponent/FooterComponent"));
const HeaderComponent = lazy(() => import("../HeaderComponent/HeaderComponent"));

export default function Registration() {
  const registrationURL = process.env.REACT_APP_REGISTRATION_URL;

  // State for form fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");

  // State for error messages
  const [usernameErr, setUsernameErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [contactNumberErr, setContactNumberErr] = useState("");
  const [addressErr, setAddressErr] = useState("");

  const navigate = useNavigate();

  // for getting the object which is sent by allevent component
  const event = useLocation().state.event;

  // it is event Id
  const eventId = event._id;
  const user = sessionStorage.getItem("user");
  const userId = JSON.parse(user)._id;

  console.log(eventId);
  console.log(userId);

  // Validation functions
  const validateUsername = (value) => {
    if (!value) {
      setUsernameErr("Username is required");
      return false;
    } else if (!/^[a-zA-Z]+$/.test(value)) {
      setUsernameErr("Username can contain only alphabet characters");
      return false;
    } else if (value.length < 5 || value.length > 50) {
      setUsernameErr("Username must be between 5-50 characters long");
      return false;
    } else {
      setUsernameErr("");
      return true;
    }
  };

  const validateEmail = (value) => {
    if (!value) {
      setEmailErr("Email is required");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      setEmailErr("Email is invalid");
      return false;
    } else {
      setEmailErr("");
      return true;
    }
  };

  const validateContactNumber = (value) => {
    if (!value) {
      setContactNumberErr("Contact Number is required");
      return false;
    } else if (!/^\d{10}$/.test(value)) {
      setContactNumberErr("Contact Number must be a 10-digit number");
      return false;
    } else {
      setContactNumberErr("");
      return true;
    }
  };

  const validateAddress = (value) => {
    if (!value) {
      setAddressErr("Address is required");
      return false;
    } else {
      setAddressErr("");
      return true;
    }
  };

  // Handlers for input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "username":
        setUsername(value);
        validateUsername(value);
        break;
      case "email":
        setEmail(value);
        validateEmail(value);
        break;
      case "contactNumber":
        setContactNumber(value);
        validateContactNumber(value);
        break;
      case "address":
        setAddress(value);
        validateAddress(value);
        break;
      default:
        break;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const isUsernameValid = validateUsername(username);
    const isEmailValid = validateEmail(email);
    const isContactNumberValid = validateContactNumber(contactNumber);
    const isAddressValid = validateAddress(address);

    // If any field is invalid, show validation error
    if (!isUsernameValid || !isEmailValid || !isContactNumberValid || !isAddressValid) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fix the errors in the form before submitting.",
      });
      return;
    }

    // Show loading state
    Swal.fire({
      title: "Loading...",
      text: "Please wait while we process your request.",
      icon: "info",
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      // for user registration
      const response = await axios.post(registrationURL, {
        username,
        email,
        contactNumber,
        address,
        userId,
        eventId,
      });

      // Stop the loading spinner
      Swal.close();

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: response.data.msg,
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/homePage");
        });
      }
    } catch (error) {
      // Stop the loading spinner
      Swal.close();

      Swal.fire({
        icon: "error",
        title: "Submission Error",
        text: "An error occurred while submitting the form. Please try again.",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <>
      <Suspense fallback={<div>Loading Header...</div>}>
        <HeaderComponent />
      </Suspense>
      <div className="container border p-3 mt-4 mb-4 border-secondary rounded">
        <h2 className="text-center mb-4">User Registration Form</h2>
        <form onSubmit={handleSubmit} id="registration-form">
          <div className="row mb-3">
            <div className="col-md-6 mb-3">
              <div className="form-floating">
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  id="username"
                  placeholder="Username"
                  value={username}
                  onChange={handleInputChange}
                />
                <small className="text-danger fs-7">{usernameErr}</small>
                <label htmlFor="username">Username</label>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="form-floating">
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  id="email"
                  placeholder="Email"
                  value={email}
                  onChange={handleInputChange}
                />
                <small className="text-danger fs-7">{emailErr}</small>
                <label htmlFor="email">Email</label>
              </div>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6 mb-3">
              <div className="form-floating">
                <input
                  type="tel"
                  name="contactNumber"
                  className="form-control"
                  id="contactNumber"
                  placeholder="Contact Number"
                  value={contactNumber}
                  onChange={handleInputChange}
                />
                <small className="text-danger fs-7">{contactNumberErr}</small>
                <label htmlFor="contactNumber">Contact Number</label>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="form-floating">
                <input
                  type="text"
                  name="address"
                  className="form-control"
                  id="address"
                  placeholder="Address"
                  value={address}
                  onChange={handleInputChange}
                />
                <small className="text-danger fs-7">{addressErr}</small>
                <label htmlFor="address">Address</label>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-start">
            <button
              style={{ backgroundColor: "rgb(0, 156, 167)", color: "white" }}
              type="submit"
              className="btn me-3">
              Apply
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-outline-secondary">
              Back
            </button>
          </div>
        </form>
      </div>
      <Suspense fallback={<div>Loading Footer...</div>}>
        <FooterComponent />
      </Suspense>
    </>
  );
}
