import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Sales.css';

export default function Sales({ products: initialProducts, setProducts, salesLog: initialSalesLog, setSalesLog, customers: initialCustomers, setCustomers }) {
  const [sale, setSale] = useState({ productId: '', customerId: '', quantity: '' });

  const [localProducts, setLocalProducts] = useState(initialProducts || []);
  const [localCustomers, setLocalCustomers] = useState(initialCustomers || []);
  const [localSalesLog, setLocalSalesLog] = useState(initialSalesLog || []);

  useEffect(() => {
    setLocalProducts(initialProducts || []);
    setLocalCustomers(initialCustomers || []);
    setLocalSalesLog(initialSalesLog || []);
  }, [initialProducts, initialCustomers, initialSalesLog]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prodRes, custRes, saleRes] = await Promise.all([
          axios.get('http://localhost:5000/products'),
          axios.get('http://localhost:5000/customers'),
          axios.get('http://localhost:5000/sales')
        ]);

        setLocalProducts(prodRes.data || []);
        setLocalCustomers(custRes.data || []);
        setLocalSalesLog(saleRes.data || []);

        setProducts(prodRes.data || []);     
        setCustomers(custRes.data || []);    
        setSalesLog(saleRes.data || []);     
      } catch (err) {
        console.error('Error loading sales:', err);
   
        setLocalProducts([]);
        setLocalCustomers([]);
        setLocalSalesLog([]);
      }
    };

    loadData();
  }, []); 

  const handleSale = async e => {
    e.preventDefault();
    const product = localProducts.find(p => p.id === parseInt(sale.productId));
    const customer = localCustomers.find(c => c.id === parseInt(sale.customerId));
    const qty = parseInt(sale.quantity);

    if (!product || qty > product.quantity || !customer) {
      alert('Invalid sale: check stock and customer');
      return;
    }

    const updatedProduct = { ...product, quantity: product.quantity - qty };
    const saleData = {
      id: Date.now(),
      productId: product.id,
      name: product.name,
      quantity: qty,
      customerId: customer.id,
      customerName: customer.name,
      date: new Date().toLocaleString()
    };

    try {
      await axios.put(`http://localhost:5000/products/${product.id}`, updatedProduct);
      await axios.post('http://localhost:5000/sales', saleData);

      const [updatedProdRes, updatedSaleRes] = await Promise.all([
        axios.get('http://localhost:5000/products'),
        axios.get('http://localhost:5000/sales')
      ]);

      setLocalProducts(updatedProdRes.data || []);
      setLocalSalesLog(updatedSaleRes.data || []);

      setProducts(updatedProdRes.data || []);
      setSalesLog(updatedSaleRes.data || []);

      setSale({ productId: '', customerId: '', quantity: '' });
    } catch (err) {
      console.error('Sale failed:', err);
      alert('Failed to record sale');
    }
  };

  return (
    <div className="sales">
      <h2>Record Sale</h2>
      <form onSubmit={handleSale}>
        <select value={sale.productId} onChange={e => setSale({ ...sale, productId: e.target.value })} required>
          <option value="">Select Product</option>
          {localProducts.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <select value={sale.customerId} onChange={e => setSale({ ...sale, customerId: e.target.value })} required>
          <option value="">Select Customer</option>
          {localCustomers.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <input type="number" placeholder="Quantity" value={sale.quantity} onChange={e => setSale({ ...sale, quantity: e.target.value })} required />
        <button type="submit">Record</button>
      </form>

      <h3>Sales Log</h3>
      <ul>
        {localSalesLog.length === 0 ? (
          <li>No sales recorded yet.</li>
        ) : (
          localSalesLog.map(log => (
            <li key={log.id}>
              <strong>{log.date}</strong> – {log.customerName} bought {log.name} × {log.quantity}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}