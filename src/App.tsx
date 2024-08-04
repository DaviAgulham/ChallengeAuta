import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../src/pages/Login";
import Home from "../src/pages/Home";
import AddCar from "../src/pages/AddCar";
import Favorites from "../src/pages/Favorites";
import CarDetails from "../src/pages/CarDetails";
import NotFound from "../src/pages/NotFound";
import TeamQueries from '../src/pages/TeamQueries'; 
import { AuthProvider } from "../src/context/AuthContext";
import ErrorComponent from "../src/components/ErrorComponent";
import ProtectedRouteComponent from "../src/components/ProtectedRoute";
import NavBar from "./components/NavBar";
import Success from '../src/pages/Success';

const App: React.FC = () => {
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleError = (message: string) => {
    setErrorMessage(message);
    setErrorOpen(true);
  };

  const handleCloseError = () => {
    setErrorOpen(false);
  };

  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRouteComponent handleError={handleError}>
              <Home />
            </ProtectedRouteComponent>
          } />
          <Route path="/add-car" element={
            <ProtectedRouteComponent requiredRole="team" handleError={handleError}>
              <AddCar />
            </ProtectedRouteComponent>
          } />
          <Route path="/team-queries" element={
            <ProtectedRouteComponent requiredRole="team" handleError={handleError}>
              <TeamQueries/>
            </ProtectedRouteComponent>
          }/>
          <Route path="/favorites" element={
            <ProtectedRouteComponent requiredRole="consumer" handleError={handleError}>
              <Favorites />
            </ProtectedRouteComponent>
          } />
          <Route path="/car/:id" element={
            <ProtectedRouteComponent handleError={handleError}>
              <CarDetails />
            </ProtectedRouteComponent>
          } />
          <Route path="*" element={<NotFound />} />
          <Route path="/success" element={<Success />} />
        </Routes>
        <ErrorComponent
          open={errorOpen}
          message={errorMessage}
          onClose={handleCloseError}
        />
      </Router>
    </AuthProvider>
  );
};

export default App;
