// src/App.tsx
import { Routes, Route } from "react-router-dom";
import Register from "./register/Register";
import Success from "./Success";
import './App.css';
import '../src/CSS/global.scss'
import VerifyNotice from "./register/VerifyNotice";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/success" element={<Success />} />
      <Route path="/verify" element={<VerifyNotice />} />
    </Routes>
  );
}

export default App;
