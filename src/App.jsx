import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./components/DashBoard";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

