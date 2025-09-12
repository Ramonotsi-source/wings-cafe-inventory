import React from 'react';
import './Dashboard.css';

function Dashboard({ setView }) {
  return (
    <div className="dashboard-grid">
      <div className="dashboard-card" onClick={() => setView('inventory')}>
        <h3>Inventory</h3>
      </div>
      
      <div className="dashboard-card" onClick={() => setView('customers')}>
        <h3>👥 Customers</h3>
      </div>

      <div className="dashboard-card" onClick={() => setView('sales')}>
        <h3>Sales</h3>
      </div>

      <div className="dashboard-card" onClick={() => setView('reports')}>
        <h3>Reporting</h3>
      </div>
    </div>
  );
}

export default Dashboard;