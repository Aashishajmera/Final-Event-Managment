import { useState } from "react";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css";
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome

export default function SignUp() {

  // GET A URL OF SIGNUP 
  const signupURL = process.env.REACT_APP_SIGNUP_URL;


  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility

  const [userNameErr, setUserNameErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");

  const navigate = useNavigate();

// Validation functions
const validateUserName = (value) => {
  // This pattern allows alphabetic characters and a single space between words
  const alphabeticPattern = /^[A-Za-z]+(?: [A-Za-z]+)*$/;

  if (!value.trim()) {
    setUserNameErr("Username is required");
  } else if (!alphabeticPattern.test(value)) {
    setUserNameErr("Username must contain only alphabetic characters");
  } else {
    setUserNameErr("");
  }
};


  const validateEmail = (value) => {
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    if (!value.trim()) {
      setEmailErr("Email is required");
    } else if (!emailPattern.test(value.toLowerCase())) {
      setEmailErr("Email is invalid");
    } else {
      setEmailErr("");
    }
  };

  const validatePassword = (value) => {
    if (!value.trim()) {
      setPasswordErr("Password is required");
    } else if (value.length < 6) {
      setPasswordErr("Password must be at least 6 characters");
    } else {
      setPasswordErr("");
    }
  };

  // Handlers for input changes
  const handleUserNameChange = (e) => {
    const value = e.target.value;
    setUserName(value);
    validateUserName(value);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value.toLowerCase());
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

    // Run all validations before submission
    validateUserName(userName);
    validateEmail(email);
    validatePassword(password);

    // Check if there are any errors
    if (userNameErr || emailErr || passwordErr) {
      await Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fix the errors in the form before submitting.",
      });
      return;
    }

    try {
      const response = await axios.post(signupURL,
        {
          userName: userName,
          email: email,
          password: password,
        }
      );

      if (response.status === 201) {
        await Swal.fire({
          icon: "success",
          title: "Success!",
          text: response.data.msg || "Sign-Up successful!",
          confirmButtonText: "OK",
        });
      }

      // Clear the form
      setUserName("");
      setEmail("");
      setPassword("");

      // Navigate to the sign-in page after success
      navigate("/signIn");
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Submission Error",
        text: error.response?.data?.msg || "Sign-Up failed. Please try again.",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <main className="main-container d-flex align-items-center justify-content-center">
      <div className="input-container p-4 m-3">
        <div className="text-center mb-3">
          <h3 className="fw-bolder">SignUp</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="floatingInputName"
              name="userName"
              placeholder="userName"
              value={userName}
              onChange={handleUserNameChange}
            />
            <small className="text-danger fs-7">{userNameErr}</small>
            <label htmlFor="floatingInputName">Username</label>
          </div>
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
            <small className="text-danger fs-7">{emailErr}</small>
            <label htmlFor="floatingInput">Email address</label>
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
            <small className="text-danger fs-7">{passwordErr}</small>
            <label htmlFor="floatingPassword">Password</label>
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
              SignUp
            </button>
            <Link to="/signIn">Already have an account?</Link>
          </div>
        </form>
      </div>
    </main>
  );
}
