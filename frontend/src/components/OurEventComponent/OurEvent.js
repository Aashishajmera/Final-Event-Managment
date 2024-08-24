import axios from "axios";
import { useEffect, useState, Suspense, lazy } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./OurEvent.css";

// Lazy load external components
const FooterComponent = lazy(() => import("../FooterComponent/FooterComponent"));
const HeaderComponent = lazy(() => import("../HeaderComponent/HeaderComponent"));

export default function OurEventComponent() {
  // URL LINK OF OUREVENT
  const ourEventURL = process.env.REACT_APP_OUREVENT_URL;
  const deleteEventURL = process.env.REACT_APP_DELETEEVENT_URL;

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Function to navigate to the new event creation page
  function newEvent() {
    navigate("/newEvent");
  }

  // Function to delete an event
  const deleteEvent = (event) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this event",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete this event",
    }).then((result) => {
      if (result.isConfirmed) {
        const _id = event._id;

        const deleteEventApi = async () => {
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
            },
          });

          try {
            const response = await axios.delete(deleteEventURL, {
              data: { _id }, // Pass _id in the request body
            });

            // Stop the loading spinner
            Swal.close();

            console.log(response);
            if (response.status === 200) {
              Swal.fire("Deleted!", "Your event has been deleted.", "success");
              // Remove the deleted event from the state
              setEvents(events.filter((e) => e._id !== _id));
            }
          } catch (error) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong! Internal error",
            });
          }
        };

        deleteEventApi();
      }
    });
  };

  useEffect(() => {
    const value = sessionStorage.getItem("user");

    if (!value) {
      setError("User not logged in or session expired.");
      setLoading(false);
      return;
    }

    const jsObject = JSON.parse(value);
    const userId = jsObject._id;

    if (!userId) {
      setError("Invalid user data.");
      setLoading(false);
      return;
    }

    const fetchEvents = async () => {
      try {
        const response = await axios.post(ourEventURL, { userId });
        if (!response.data.allEvents || response.data.allEvents.length === 0) {
          Swal.fire({
            icon: "info",
            title: "No Events Found",
            text: "There are no events available for the given user ID.",
            confirmButtonText: "OK",
          });
        } else {
          setEvents(response.data.allEvents);
        }
      } catch (err) {
        setError("Failed to fetch events.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const formatDate = (isoDate) => {
    if (!isoDate) return "N/A";
    const date = new Date(isoDate);
    return date.toISOString().split("T")[0];
  };

  if (loading) {
    return (
      <>
        <Suspense fallback={<div>Loading header...</div>}>
          <HeaderComponent />
        </Suspense>
        <p>Loading events...</p>
        <Suspense fallback={<div>Loading footer...</div>}>
          <FooterComponent />
        </Suspense>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Suspense fallback={<div>Loading header...</div>}>
          <HeaderComponent />
        </Suspense>
        <p>Error: {error}</p>
        <Suspense fallback={<div>Loading footer...</div>}>
          <FooterComponent />
        </Suspense>
      </>
    );
  }

  return (
    <>
      <Suspense fallback={<div>Loading header...</div>}>
        <HeaderComponent />
      </Suspense>
      {events.length > 0 ? <h2 className="m-3">Event List</h2> : ""}

      {events.length === 0 ? (
        <>
          <h1 className="ms-2">No events found.</h1>
          <button
            style={{
              backgroundColor: "rgb(0, 156, 167)",
              color: "white",
            }}
            onClick={newEvent}
            className="btn m-2">
            Create Event
          </button>
          <button
            onClick={() => {
              navigate(-1);
            }}
            className="btn ps-4 pe-4 ms-2 btn-outline-secondary">
            back
          </button>
        </>
      ) : (
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
                <th scope="col">Edit</th>
                <th scope="col">Delete</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => (
                <tr key={event._id || index}>
                  <td>{index + 1}</td>
                  <td>{event.title || "N/A"}</td>
                  <td>{event.description || "N/A"}</td>
                  <td>{formatDate(event.date)}</td>
                  <td>{event.time || "N/A"}</td>
                  <td>{event.location || "N/A"}</td>
                  <td>{event.capacity || "N/A"}</td>
                  <td>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() =>
                        navigate(`/editEvent`, { state: { event } })
                      }>
                      Edit
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => deleteEvent(event)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            style={{
              backgroundColor: "rgb(0, 156, 167)",
              color: "white",
            }}
            className="btn"
            onClick={newEvent}>
            Create Event
          </button>
          <button
            onClick={() => {
              navigate("/homePage");
            }}
            className="btn ps-4 pe-4 ms-2 btn-outline-secondary">
            back
          </button>
        </div>
      )}
      <Suspense fallback={<div>Loading footer...</div>}>
        <FooterComponent />
      </Suspense>
    </>
  );
}
