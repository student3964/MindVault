import { Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import UploadNotesPage from './pages/uploadNotes';
import LoginPage from './pages/login';
import SignupPage from './pages/signup';
import AboutPage from './pages/About';
import Workspace from './pages/Workspace/Workspace'; // <-- IMPORT

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/upload-notes" element={<UploadNotesPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/workspace" element={<Workspace />} /> 
    </Routes>
  );
}

export default App;

