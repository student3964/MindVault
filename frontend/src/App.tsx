import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Layout from './components/Layout';

import Home from "./pages/Home";
import UploadNotesPage from './pages/uploadNotes';
import LoginPage from './pages/login';
import SignupPage from './pages/signup';
import AboutPage from './pages/About';
import Workspace from './pages/Workspace/Workspace';
// import ProtectedRoute from './components/ProtectedRoute'; // <-- Import the guard

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          {/* Add any other public pages that need the layout here */}
        </Route>

        <Route path="/upload-notes" element={<UploadNotesPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route path="/workspace" element={<Workspace />} />
        {/* This route is now protected */}
        {/* <Route 
          path="/workspace" 
          element={
            <ProtectedRoute>
              <Workspace />
            </ProtectedRoute>
          } 
        /> */}
      </Routes>
    </AuthProvider>
  );
}

export default App;
