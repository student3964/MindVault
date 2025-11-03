import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Layout from './components/Layout';
import Home from "./pages/Home";
import UploadNotesPage from './pages/uploadNotes';
import LoginPage from './pages/login';
import SignupPage from './pages/signup';
import AboutPage from './pages/About';
import Workspace from './pages/Workspace/Workspace';
// import ProtectedRoute from './components/ProtectedRoute'; // <-- You can re-enable this later

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* 👇 All routes inside here will have the Navbar and Footer */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/workspace" element={<Workspace />} />
          {/* If you want to protect the workspace, you can wrap it like this later:
            <Route 
              path="/workspace" 
              element={
                <ProtectedRoute>
                  <Workspace />
                </ProtectedRoute>
              } 
            />
          */}
        </Route>

        {/* 👇 These routes are standalone and will NOT have the main layout */}
        <Route path="/upload-notes" element={<UploadNotesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

      </Routes>
    </AuthProvider>
  );
}

export default App;