import { Outlet, Link } from "react-router-dom";

function MainLayout() {
  return (
    <div style={{ display: "flex" }}>
      <aside
        style={{
          width: "200px",
          padding: "20px",
          borderRight: "1px solid #ccc",
        }}
      >
        <nav>
          <ul>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/owners">Owners</Link>
            </li>
            <li>
              <Link to="/pets">Pets</Link>
            </li>
            <li>
              <Link to="/appointments">Appointments</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main style={{ padding: "20px", width: "100%" }}>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
