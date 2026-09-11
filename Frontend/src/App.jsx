import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

// We will split this Layout to a separate file later
function Layout() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <h3>Admin Panel</h3>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

// Temporary placeholder for dashboard component
const Dashboard = () => (
  <div className="card">
    <h2>Dashboard Under Construction</h2>
    <p>We are setting up the structure!</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
