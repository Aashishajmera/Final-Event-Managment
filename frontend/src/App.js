import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";

// Lazy load components
const Feedback = lazy(()=> import('./components/FeedbackCompo/Feedback'))
const SignUp = lazy(() => import("./components/LoginComponent/Signup"));
const SignIn = lazy(() => import("./components/LoginComponent/Signin"));
const HomePage = lazy(() => import("./components/HomeComponent/HomePageComponent"));
const HeaderComponent = lazy(() => import("./components/HeaderComponent/HeaderComponent"));
const FooterComponent = lazy(() => import("./components/FooterComponent/FooterComponent"));
const AllEventList = lazy(() => import("./components/EventListComponent/AllEventList"));
const OurEventComponent = lazy(() => import("./components/OurEventComponent/OurEvent"));
const CreateNewEvent = lazy(() => import("./components/NewEventComponent/NewEventCreate"));
const EditEvent = lazy(() => import("./components/EditComponent/EditEvent"));
const Registration = lazy(() => import("./components/RegistrationComponent/Registration"));

function App() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/signIn" element={<SignIn />} />
          <Route path="/homePage" element={<HomePage />} />
          <Route path="/header" element={<HeaderComponent />} />
          <Route path="/footer" element={<FooterComponent />} />
          <Route path="/eventList" element={<AllEventList />} />
          <Route path="/ourEvent" element={<OurEventComponent />} />
          <Route path="/newEvent" element={<CreateNewEvent />} />
          <Route path="/editEvent" element={<EditEvent />} />
          <Route path="/registrationForm" element={<Registration />} />
          <Route path="/feedback" element={<Feedback/>}/>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
