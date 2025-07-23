import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute'; // or { PrivateRoute } if named export
import SuperManagerDashboard from './pages/SuperManagerDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes */}
        <Route element={<PrivateRoute allowedRoles={['supermanager']} />}>
          <Route path="/supermanager" element={<SuperManagerDashboard />} />
        </Route>
        
        <Route element={<PrivateRoute allowedRoles={['manager']} />}>
          <Route path="/manager" element={<ManagerDashboard />} />
        </Route>
        
        <Route element={<PrivateRoute allowedRoles={['employee']} />}>
          <Route path="/employee" element={<EmployeeDashboard />} />
        </Route>
        
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;