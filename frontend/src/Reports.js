import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Report.css';

export default function Reports({ products: initialProducts, customers: initialCustomers, salesLog: initialSalesLog }) {
  const [localProducts, setLocalProducts] = useState(initialProducts);
  const [localCustomers, setLocalCustomers] = useState(initialCustomers);
  const [localSalesLog, setLocalSalesLog] = useState(initialSalesLog);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLocalProducts(initialProducts);
    setLocalCustomers(initialCustomers);
    setLocalSalesLog(initialSalesLog);
  }, [initialProducts, initialCustomers, initialSalesLog]);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const [prodRes, salesRes] = await Promise.all([
          axios.get('http://localhost:5000/products'),
          axios.get('http://localhost:5000/sales')
        ]);

        setLocalProducts(prodRes.data);
        setLocalSalesLog(salesRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading reports:', err);
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  if (loading) return <div className="reports"><p>Loading report...</p></div>;

  const totalSold = localSalesLog.reduce((sum, s) => sum + s.quantity, 0);
  const lowStock = localProducts.filter(p => p.quantity < 5);
  const mostSoldMap = localSalesLog.reduce((map, s) => {
    map[s.name] = (map[s.name] || 0) + s.quantity;
    return map;
  }, {});
  const topProduct = Object.entries(mostSoldMap).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="reports">
      <h2>Reports Summary</h2>
      <p><strong>Total Products:</strong> {localProducts.length}</p>
      <p><strong>Total Items Sold:</strong> {totalSold}</p>
      {topProduct && (
        <p><strong>Most Sold Product:</strong> {topProduct[0]} ({topProduct[1]})</p>
      )}

      <h3>⚠️ Low Stock Products</h3>
      {lowStock.length === 0 ? (
        <p>✅ All products are well stocked.</p>
      ) : (
        <ul>
          {lowStock.map(p => (
            <li key={p.id}>{p.name} – {p.quantity} left</li>
          ))}
        </ul>
      )}
    </div>
  );
}