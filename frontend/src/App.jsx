import Sidebar from "./components/Sidebar";
import { Route, Routes, Navigate } from "react-router-dom";
import Topbar from "./components/Topbar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import HR from "./pages/HR.jsx";
import Meeting from "./pages/Meeting.jsx";
import Support from "./pages/Support.jsx";

function App() {
  return (
    <div>
      <div>
        <Sidebar />
        <main>
          <Topbar />
          <div className=" p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/hr" element={<HR />} />
              <Route path="/meeting" element={<Meeting />} />
              <Route path="/support" element={<Support />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
