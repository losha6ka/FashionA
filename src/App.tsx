// src/App.tsx
import { Routes, Route } from "react-router-dom";
import Register from "./register/Register";
import Success from "./Success";
import VerifyNotice from "./register/VerifyNotice";
import EmailVerificationHandler from "./register/EmailVerificationHandler";
import './App.css';
import '../src/CSS/global.scss'


function App() {
  return (
    <Routes>
      <Route path="/verify-email" element={<EmailVerificationHandler />} />
      <Route path="/" element={<Register />} />
      <Route path="/success" element={<Success />} />
      <Route path="/verify" element={<VerifyNotice />} />
    </Routes>
  );
}

export default App;
