import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import VehicleForm from "./components/VehicleForm";
import FormOutput from "./components/FormOutput";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VehicleForm />} />
        <Route path="/upload" element={<FormOutput />} />
      </Routes>
    </Router>
  );
};

export default App;
