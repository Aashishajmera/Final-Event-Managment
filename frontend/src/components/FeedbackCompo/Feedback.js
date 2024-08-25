import axios from "axios";
import React, { lazy, Suspense, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// Lazy load the components
const HeaderComponent = lazy(() =>
  import("../HeaderComponent/HeaderComponent")
);
const FooterComponent = lazy(() =>
  import("../FooterComponent/FooterComponent")
);

// Fallback UI for Suspense
const fallbackUI = <div>Loading...</div>;

export default function Feedback() {
  const [feedback, setFeedback] = useState("");
  const [feedbackErr, setFeedbackErr] = useState("");
  const navigate = useNavigate();

  // fot getting the event id

  const eventId = useLocation().state._id;

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation for feedback
    if (!feedback) {
      setFeedbackErr("Feedback is required");

      // Show SweetAlert for validation error
      await Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please provide your feedback before submitting.",
      });

      return;
    }
    setFeedbackErr("");

    // Show loading message while processing
    Swal.fire({
      title: "Submitting...",
      text: "Please wait while we process your feedback.",
      icon: "info",
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });

    // get the user id in session storage
    const userObj = sessionStorage.getItem("user");
    const userId = JSON.parse(userObj)._id;

    console.log("i am event id", eventId);
    console.log("i am user id", userId);

    // get current date and time
    const date = new Date();
    // Get ISO string format of the current date and time
    const isoString = date.toISOString(); // Example: 2024-08-24T12:33:45.123Z
    // Append '11' to the end of the string
    const dateTime = isoString + "11";

    try {
      const response = await axios.post("http://localhost:3000/feedback/createfeedback", {
        userId,
        eventId,
        dateTime,
        review: feedback,
      }); // Simulate network delay
      if (response.status === 201) {
        Swal.close(); // Close the loading message

        // Show success message
        await Swal.fire({
          icon: "success",
          title: "Feedback Submitted",
          text: "Thank you for your feedback!",
        });

        navigate('/homePage')

        // Clear feedback input field after submission (optional)
        setFeedback("");
      }
    } catch (error) {
      // Handle submission error
      Swal.close(); // Close the loading message

      await Swal.fire({
        icon: "error",
        title: "Submission Error",
        text: "There was an error submitting your feedback. Please try again.",
      });
    }
  };

  return (
    <>
      <Suspense fallback={fallbackUI}>
        <HeaderComponent />
      </Suspense>
      <div className="container border p-3 mt-4 mb-4 border-secondary rounded">
        <h2 className="text-center mb-4">Feedback Form</h2>
        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-md-12">
              <div className="form-floating">
                <textarea
                  className="form-control "
                  id="feedback"
                  placeholder="Leave your feedback here"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows="8"
                />
                <small className="text-danger fs-7">{feedbackErr}</small>
                <label htmlFor="feedback">Feedback</label>
              </div>
            </div>
          </div>
          <div className="">
            <button
              style={{
                backgroundColor: "rgb(0, 156, 167)",
                color: "white",
                fontSize: "16px",
              }}
              type="submit"
              className="btn">
              Submit
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-outline-secondary ms-2 ps-4 pe-4"
              style={{ fontSize: "16px" }}>
              Back
            </button>
          </div>
        </form>
      </div>
      <Suspense fallback={fallbackUI}>
        <FooterComponent />
      </Suspense>
    </>
  );
}
