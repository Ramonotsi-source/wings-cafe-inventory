import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Inventory from './Inventory';
import Sales from './Sales';
import Customers from './Customers';
import Reports from './Reports';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import AboutUs from './AboutUs';
import Contact from './Contact';
import Footer from './Footer';
import './App.css';

export default function App() {
  const [view, setView] = useState('inventory');
  const [products, setProducts] = useState([]);
  const [salesLog, setSalesLog] = useState([]);
  const [customers, setCustomers] = useState([]);

  // 👇 This loads data from your backend — already correct
  useEffect(() => {
    axios.get('http://localhost:5000/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error loading products:', err));

    axios.get('http://localhost:5000/customers')
      .then(res => setCustomers(res.data))
      .catch(err => console.error('Error loading customers:', err));

    axios.get('http://localhost:5000/sales')
      .then(res => setSalesLog(res.data))
      .catch(err => console.error('Error loading sales:', err));
  }, []);

  return (
    <main className="main-content">
      <Sidebar setView={setView} />
      <div className="app">
        <h1>Wings Cafe Inventory System</h1>
        <Dashboard setView={setView} />

        {view === 'inventory' && (
          <Inventory products={products} setProducts={setProducts} />
        )}

        {view === 'sales' && (
          <Sales
            products={products}
            setProducts={setProducts}
            salesLog={salesLog}
            setSalesLog={setSalesLog}
          />
        )}

        {view === 'customers' && (
          <Customers customers={customers} setCustomers={setCustomers} />
        )}

        {view === 'reports' && (
          <Reports products={products} customers={customers} salesLog={salesLog} />
        )}

        {view === 'about' && <AboutUs />}
        {view === 'contact' && <Contact />}

        <Footer />
      </div>
    </main>
  );
}