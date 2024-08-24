import React, { useState, useEffect, lazy, Suspense } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Lazy load components
const HeaderComponent = lazy(() => import("../HeaderComponent/HeaderComponent"));
const FooterComponent = lazy(() => import("../FooterComponent/FooterComponent"));

export default function AllEventList() {
  const alleventURL = process.env.REACT_APP_ALLEVENT_URL;
  const checkUserRegistrationURL =
    "http://localhost:3000/userRegistrationapi/chekUserRagistration";

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState({});

  const navigate = useNavigate();

  const user = sessionStorage.getItem("user");
  const jsObjectUser = JSON.parse(user);
  const userId = jsObjectUser._id;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(alleventURL);
        const sortedEvents = response.data.allEvents.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA - dateB;
        });

        setEvents(sortedEvents);
        checkRegistrations(sortedEvents);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const checkRegistrations = async (events) => {
      const registrationStatuses = {};

      for (let event of events) {
        try {
          const res = await axios.post(checkUserRegistrationURL, {
            userId: userId,
            eventId: event._id,
          });

          if (
            res.status === 200 &&
            res.data.message === "User is already registered for this event"
          ) {
            registrationStatuses[event._id] = true;
          } else {
            registrationStatuses[event._id] = false;
          }
        } catch (err) {
          console.error("Error checking user registration:", err);
        }
      }

      setRegisteredEvents(registrationStatuses);
    };

    fetchEvents();
  }, [alleventURL, userId]);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2>Error: {error}</h2>;
  }

  const formatDate = (isoDate) => {
    if (!isoDate) return "N/A";
    const date = new Date(isoDate);
    return date.toISOString().split("T")[0];
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeaderComponent />
      <h2 className="m-3">Event List.....</h2>
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th scope="col">S.no</th>
              <th scope="col">Title</th>
              <th scope="col">Description</th>
              <th scope="col">Date</th>
              <th scope="col">Time</th>
              <th scope="col">Location</th>
              <th scope="col">Capacity</th>
              <th scope="col">Action's</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr key={event.id || index}>
                <td>{index + 1}</td>
                <td>{event.title || "N/A"}</td>
                <td>{event.description || "N/A"}</td>
                <td>{formatDate(event.date) || "N/A"}</td>
                <td>{event.time || "N/A"}</td>
                <td>{event.location || "N/A"}</td>
                <td>{event.capacity || "N/A"}</td>
                <td>
                  {registeredEvents[event._id] ? (
                    <>
                      <button className="ms-2 btn-success btn">
                        feedback
                      </button>
                    </>
                  ) : (
                    <button
                    style={{
                        backgroundColor: "rgb(0, 156, 167)",
                        color: "white",
                      }}
                      className="btn"
                      onClick={() => {
                        navigate("/registrationForm", { state: { event } });
                      }}>
                      Apply
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <FooterComponent />
    </Suspense>
  );
}
