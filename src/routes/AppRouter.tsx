import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

//PAGINAS PRINCIPALES
import MainLayout from "../layout/MainLayout";
import ProtectedRoute from "../routes/ProtectedRoute";
import AuthCallback from "../pages/callback/AuthCallback";
import RootRedirect from "./RootRedirect";
import PublicRoute from "../routes/PublicRoute";
//PAGINAS
import Dashboard from "../pages/dashboard/Dashboard";
import Login from "../pages/auth/Login";
import { OwnersList } from "../pages/owners/OwnersList";
import { OwnersForm } from "../pages/owners/OwnersForm";
import { OwnerDetail } from "../pages/owners/OwnerDetail";
import { PetsDetail } from "../pages/pets/PetsDetail";
import { PetsForm } from "../pages/pets/PetsForm";
import { PetsList } from "../pages/pets/PetsList";
import { MedicalRecordForm } from "../pages/medical/MedicalRecordForm";
import { AppointmentForm } from "../pages/appoinments/AppointmentForm";
import { AppointmentList } from "../pages/appoinments/AppointmentList";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ROOT*/}
        <Route path="/" element={<RootRedirect />} />

        {/* LOGIN */}
        {/* SOLO CUANDO NO HAY USUARIO TE DEJA INGRESAR AQUI */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        {/* CALLBACK ESTA RUTA VIENE EL SIGN IN*/}
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* RUTAS PROTEGIDAS */}
        {/* SI NO ESTA USER NO TE DEJA ACCEDER Y TE REDIRIGE A LOGIN */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Owners */}
          <Route path="/owners" element={<OwnersList />} />
          <Route path="/owners/new" element={<OwnersForm />} />
          <Route path="/owners/:id" element={<OwnerDetail />} />

          {/* Pets */}
          <Route path="/pets" element={<PetsList />} />
          <Route path="/pets/new" element={<PetsForm />} />
          <Route path="/pets/:id" element={<PetsDetail />} />

          {/* Medical */}
          <Route path="/pets/:id/records/new" element={<MedicalRecordForm />} />

          {/* Appointments */}
          <Route path="/appointments" element={<AppointmentList />} />
          <Route path="/appointments/new" element={<AppointmentForm />} />
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
