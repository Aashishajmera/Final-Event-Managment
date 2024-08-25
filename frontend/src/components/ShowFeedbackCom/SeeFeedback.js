import axios from "axios";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// Lazy load the HeaderComponent and FooterComponent
const HeaderComponent = lazy(() =>
  import("../HeaderComponent/HeaderComponent")
);
const FooterComponent = lazy(() =>
  import("../FooterComponent/FooterComponent")
);

export default function SeeFeedback() {
  const [feedback, setFeedbackList] = useState([]);
  const navigate = useNavigate();
  const eventId = useLocation().state;

  useEffect(() => {
    const feedbackList = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3000/feedback/seeFeedback",
          { eventId }
        );

        if (response.status === 204) {
          Swal.fire({
            title: "No Feedback Found",
            text: "There are no feedbacks for this event yet.",
            icon: "warning",
            confirmButtonText: "OK",
          });
        }

        if (response.status === 200) {
          setFeedbackList(response.data.feedbackList);
        }
      } catch (error) {
        console.log("Error while getting feedback list", error);
      }
    };

    feedbackList();
  }, [eventId]);

  return (
    <>
      <Suspense fallback={<div>Loading header...</div>}>
        <HeaderComponent />
      </Suspense>

      <div className="container border rounded border-secondary mt-3 mb-3 p-4">
        <h3 className="text-center border-bottom border-secondary pb-4">USER FEEDBACK</h3>
        {feedback.length === 0 ? (
          <p>No feedback available.</p>
        ) : (
          feedback.map((item, index) => (
            <div
              key={index}
              className=" border-bottom border-secondary p-2 mb-3">
              <div>
                <span className="fw-bold">Name: </span>
                {item.userId.userName}
              </div>
              <div>
              <span className="fw-bold">Date: </span>
                {new Date(item.dateTime).toLocaleDateString()}
              </div>
              <div>
              <span className="fw-bold">Time: </span>
                {new Date(item.dateTime).toLocaleTimeString()}
              </div>
              <p>
                <span className="fw-bold">Review: </span>
                {item.review}
              </p>
            </div>
          ))
        )}
        <div className="row">
          <div className="col-md-3 p-0">
            <button
              onClick={() => navigate("/ourEvent")}
              className="btn btn-outline-secondary ps-4 pe-4 m-2">
              Back
            </button>
          </div>
        </div>
      </div>

      <Suspense fallback={<div>Loading footer...</div>}>
        <FooterComponent />
      </Suspense>
    </>
  );
}
