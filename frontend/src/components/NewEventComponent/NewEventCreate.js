import React, { useState, lazy, Suspense } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Lazy load external components
const FooterComponent = lazy(() => import("../FooterComponent/FooterComponent"));
const HeaderComponent = lazy(() => import("../HeaderComponent/HeaderComponent"));

export default function CreateNewEvent() {
    // URL for creating a new event from environment variables
    const newEventURL = process.env.REACT_APP_NEWEVENT_URL;

    // State variables for form input and errors
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [time24, setTime24] = useState("");
    const [time12, setTime12] = useState("");
    const [location, setLocation] = useState("");
    const [capacity, setCapacity] = useState("");

    const [titleErr, setTitleErr] = useState("");
    const [descriptionErr, setDescriptionErr] = useState("");
    const [dateErr, setDateErr] = useState("");
    const [timeErr, setTimeErr] = useState("");
    const [locationErr, setLocationErr] = useState("");
    const [capacityErr, setCapacityErr] = useState("");

    const navigate = useNavigate();

    // Validation functions
    const validateTitle = (value) => {
        if (!value) {
            setTitleErr("Title is required");
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
            setTitleErr("Title can contain only alphabet characters and spaces");
        } else if (value.length < 5 || value.length > 50) {
            setTitleErr("Title must be between 5 and 50 characters long");
        } else {
            setTitleErr("");
        }
    };

    const validateDescription = (value) => {
        if (!value) {
            setDescriptionErr("Description is required");
        } else {
            setDescriptionErr("");
        }
    };

    const validateDate = (value) => {
        const today = new Date().toISOString().split("T")[0];
        if (!value) {
            setDateErr("Date is required");
        } else if (value < today) {
            setDateErr("Date cannot be before today");
        } else {
            setDateErr("");
        }
    };

    const validateTime = (value) => {
        if (!value) {
            setTimeErr("Time is required");
        } else if (!/^([01]?[0-9]|2[0-3]):([0-5][0-9])\s?(AM|PM)$/.test(value)) {
            setTimeErr("Time must be in hh:mm AM/PM format with AM/PM in uppercase");
        } else {
            setTimeErr("");
        }
    };

    const validateLocation = (value) => {
        if (!value) {
            setLocationErr("Location is required");
        } else {
            setLocationErr("");
        }
    };

    const validateCapacity = (value) => {
        if (!value) {
            setCapacityErr("Capacity is required");
        } else if (isNaN(value) || value <= 0) {
            setCapacityErr("Capacity must be a positive number");
        } else {
            setCapacityErr("");
        }
    };

    // Event handlers
    const handleTitleChange = (e) => {
        const value = e.target.value;
        setTitle(value);
        validateTitle(value);
    };

    const handleDescriptionChange = (e) => {
        const value = e.target.value;
        setDescription(value);
        validateDescription(value);
    };

    const handleDateChange = (e) => {
        const value = e.target.value;
        setDate(value);
        validateDate(value);
    };

    const convertTo12HourFormat = (time24) => {
        const [hours, minutes] = time24.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const adjustedHours = hours % 12 || 12;
        return `${String(adjustedHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
    };

    const handleTimeChange = (e) => {
        const value24Hour = e.target.value;
        const value12Hour = convertTo12HourFormat(value24Hour);
        setTime24(value24Hour);
        setTime12(value12Hour);
        validateTime(value12Hour);
    };

    const handleLocationChange = (e) => {
        const value = e.target.value;
        setLocation(value);
        validateLocation(value);
    };

    const handleCapacityChange = (e) => {
        const value = e.target.value;
        setCapacity(value);
        validateCapacity(value);
    };

    // Get the user id from session storage
    let userId = sessionStorage.getItem("user");
    userId = JSON.parse(userId)._id;

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        validateTitle(title);
        validateTime(time12);
        validateDescription(description);
        validateDate(date);
        validateLocation(location);
        validateCapacity(capacity);

        // Check for errors before submitting
        if (titleErr || descriptionErr || dateErr || timeErr || locationErr || capacityErr) {
            await Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Please fix the errors in the form before submitting.",
            });
            return;
        }

        // Submit the form data
        try {
            const response = await axios.post(newEventURL, {
                title, description, date, time: time12, location, capacity, userId
            });

            if (response.status === 201) {
                await Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: "Event created successfully.",
                });
                navigate('/ourEvent');
            }

            // Clear form fields
            setTitle("");
            setDescription("");
            setDate("");
            setLocation("");
            setCapacity("");
        } catch (error) {
            console.log(error);
            await Swal.fire({
                icon: "error",
                title: "Submission Error",
                text: "There was an error creating the event. Please try again.",
            });
        }
    };

    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <HeaderComponent />
            </Suspense>
            <div className="container border p-3 mt-4 mb-4 border-secondary rounded">
                <h2 className="text-center mb-4">Create Event</h2>
                <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                        <div className="col-md-6 mb-3">
                            <div className="form-floating">
                                <input type="text" value={title} onChange={handleTitleChange} className="form-control" id="title" placeholder="Event Title" />
                                <small className="text-danger fs-7">{titleErr}</small>
                                <label htmlFor="title">Title</label>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-floating">
                                <input type="text" value={description} onChange={handleDescriptionChange} className="form-control" id="description" placeholder="Event Description" />
                                <small className="text-danger fs-7">{descriptionErr}</small>
                                <label htmlFor="description">Description</label>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-6 mb-3">
                            <div className="form-floating">
                                <input type="date" value={date} onChange={handleDateChange} className="form-control" id="date" placeholder="Event Date" min={new Date().toISOString().split("T")[0]} />
                                <small className="text-danger fs-7">{dateErr}</small>
                                <label htmlFor="date">Date</label>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-floating">
                                <input type="time" value={time24} onChange={handleTimeChange} className="form-control" id="time" placeholder="Event Time (hh:mm AM/PM)" />
                                <small className="text-danger fs-7">{timeErr}</small>
                                <label htmlFor="time">Time</label>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-6 mb-3">
                            <div className="form-floating">
                                <input type="text" value={location} onChange={handleLocationChange} className="form-control" id="location" placeholder="Event Location" />
                                <small className="text-danger fs-7">{locationErr}</small>
                                <label htmlFor="location">Location</label>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-floating">
                                <input type="number" value={capacity} onChange={handleCapacityChange} className="form-control" id="capacity" placeholder="Event Capacity" />
                                <small className="text-danger fs-7">{capacityErr}</small>
                                <label htmlFor="capacity">Capacity</label>
                            </div>
                        </div>
                    </div>
                    <div className="">
                        <button style={{ backgroundColor: 'rgb(0, 156, 167)', color: 'white', fontSize: '16px' }} type="submit" className="btn">
                            Create Event
                        </button>
                        <button type="button" onClick={() => { navigate(-1); }} className="btn btn-outline-secondary ms-2 ps-4 pe-4" style={{ fontSize: '16px' }}>
                            Back
                        </button>
                    </div>
                </form>
            </div>
            <Suspense fallback={<div>Loading...</div>}>
                <FooterComponent />
            </Suspense>
        </>
    );
}
