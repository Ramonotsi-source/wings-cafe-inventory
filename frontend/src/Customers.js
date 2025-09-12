import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Customer.css';

const notify = (message, type = 'success') => {
  if (typeof window !== 'undefined') {
    const alertBox = document.createElement('div');
    alertBox.style.position = 'fixed';
    alertBox.style.top = '1rem';
    alertBox.style.right = '1rem';
    alertBox.style.padding = '1rem';
    alertBox.style.backgroundColor = type === 'error' ? '#dc3545' : '#28a745';
    alertBox.style.color = 'white';
    alertBox.style.borderRadius = '4px';
    alertBox.style.zIndex = '9999';
    alertBox.style.fontSize = '0.9rem';
    alertBox.innerText = message;
    document.body.appendChild(alertBox);
    setTimeout(() => alertBox.remove(), 3000);
  }
};

export default function Customers({ customers: initialCustomers, setCustomers }) {
  const [form, setForm] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 👇 Use props passed from App — DO NOT override with local state
  const [localCustomers, setLocalCustomers] = useState(initialCustomers);

  useEffect(() => {
    // Sync prop updates (in case parent reloads)
    setLocalCustomers(initialCustomers);
  }, [initialCustomers]);

  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get('http://localhost:5000/customers');
        setLocalCustomers(res.data);
        setCustomers(res.data); // 👈 Sync back to parent
      } catch (err) {
        console.error('Error loading customers:', err);
        setError('Failed to load customers.');
        notify('Failed to load customers.', 'error');
      } finally {
        setLoading(false);
      }
    };

    // Load on mount
    loadCustomers();
  }, []);

  const add = async e => {
    e.preventDefault();
    const newCustomer = { ...form, id: Date.now() };

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5000/customers', newCustomer);
      const updatedRes = await axios.get('http://localhost:5000/customers');
      setLocalCustomers(updatedRes.data);
      setCustomers(updatedRes.data); // 👈 Sync to parent
      setForm({ name: '', email: '' });
      notify('Customer added successfully!');
    } catch (err) {
      console.error('Error adding customer:', err);
      notify('Failed to add customer.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const remove = async id => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;

    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/customers/${id}`);
      const res = await axios.get('http://localhost:5000/customers');
      setLocalCustomers(res.data);
      setCustomers(res.data); // 👈 Sync to parent
      notify('Customer deleted successfully!');
    } catch (err) {
      console.error('Error deleting customer:', err);
      notify('Failed to delete customer.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = localCustomers.filter(
    c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="customers">
      <h2>Customer Management</h2>

      <input
        type="text"
        placeholder="Search customers..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '1rem', padding: '0.5rem', width: '100%' }}
      />

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={add}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          required
        />
        <button type="submit">Add</button>
      </form>

      <ul>
        {filteredCustomers.map(c => (
          <li key={c.id}>
            {c.name} ({c.email}){' '}
            <button onClick={() => remove(c.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {filteredCustomers.length === 0 && !loading && !error && (
        <p>No customers found.</p>
      )}
    </div>
  );
}