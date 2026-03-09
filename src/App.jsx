import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FormComponent from "./FormComponent";
import DownloadPDF from "./Download";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FormComponent />} />
      <Route path="/download" element={<DownloadPDF />} />
      </Routes>
    </Router>
  );
}

export default App;
