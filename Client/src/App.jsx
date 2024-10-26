import { Routes, Route } from "react-router-dom";
import SignUpForm from "./pages/Register.jsx";
import SignInForm from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import LiveStreamPage from "./pages/LiveStream.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/Login" element={<SignInForm />} />
        <Route path="/live" element={<LiveStreamPage />} />
      </Routes>
    </>
  );
}
export default App;
