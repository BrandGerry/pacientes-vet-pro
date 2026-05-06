import { Outlet, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useUserStore } from "../store/useUserStore";
import { LogOut } from "lucide-react";

function MainLayout() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { fetchProfile, loading, reset } = useUserStore();

  useEffect(() => {
    if (user) {
      fetchProfile(); // solo si hay sesión activa
    }
  }, [user]);

  const linkStyles = (path: string) =>
    `block px-4 py-2 rounded-lg transition ${
      location.pathname === path
        ? "bg-green-200 text-green-900 font-semibold"
        : "text-gray-700 hover:bg-green-100"
    }`;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* OVERLAY MOBILE */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed z-50 top-0 left-0 h-full w-64 bg-white border-r shadow-sm transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:z-auto`}
      >
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-green-700">🐾 VetCare</h1>
          <p className="text-sm text-gray-500">Sistema veterinario</p>
        </div>

        <nav className="p-4 space-y-2">
          <Link
            to="/dashboard"
            className={linkStyles("/dashboard")}
            onClick={() => setOpen(false)}
          >
            📊 Dashboard
          </Link>

          <Link
            to="/owners"
            className={linkStyles("/owners")}
            onClick={() => setOpen(false)}
          >
            👤 Owners
          </Link>

          <Link
            to="/pets"
            className={linkStyles("/pets")}
            onClick={() => setOpen(false)}
          >
            🐶 Pets
          </Link>

          <Link
            to="/appointments"
            className={linkStyles("/appointments")}
            onClick={() => setOpen(false)}
          >
            📅 Appointments
          </Link>
        </nav>
      </aside>

      {/* CONTENT */}
      <div className="flex flex-col flex-1 w-full">
        {/* HEADER */}
        <header className="bg-white border-b px-4 py-4 shadow-sm flex items-center justify-between lg:px-6">
          <div className="flex items-center gap-3">
            {/* BOTÓN HAMBURGUESA */}
            <button
              className="lg:hidden text-gray-700"
              onClick={() => setOpen(true)}
            >
              ☰
            </button>

            <h2 className="text-lg font-semibold text-gray-800">
              Panel de Control
            </h2>
          </div>
          <div className="flex flex-col items-end gap-2">
            <p className="text-sm text-gray-600 hidden sm:block">👨‍⚕️ Doctor</p>
            <div className="flex gap-3">
              <p className="text-sm text-gray-600 hidden md:block">
                {user?.email}
              </p>
              <button
                className="text-sm text-gray-600  cursor-pointer hover:text-gray-900"
                onClick={() => {
                  reset();
                  logout();
                }}
              >
                {<LogOut size={18} />}
              </button>
            </div>
          </div>
        </header>

        {/* MAIN */}
        <main className="p-4 sm:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
