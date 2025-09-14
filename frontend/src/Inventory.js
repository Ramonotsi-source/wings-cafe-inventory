import React, { useState, useEffect } from 'react';
import './inverntory.css';

export default function Inventory({ products: initialProducts, setProducts }) {
  const [form, setForm] = useState({ id: null, name: '', description: '', category: '', price: '', quantity: '' });
  const [localProducts, setLocalProducts] = useState(initialProducts || []);

  useEffect(() => {
    setLocalProducts(initialProducts || []);
  }, [initialProducts]);

  const mockFetch = () => Promise.resolve([{ id: 1, name: 'Mock Product', category: 'Electronics', price: 99.99, quantity: 10 }]);

  const handleSubmit = async e => {
    e.preventDefault();
    const newProduct = { ...form, price: +form.price, quantity: +form.quantity, id: form.id ?? Date.now() };
    try {
      console.log('Simulating save:', newProduct);
      // Simulate API call
      const updatedList = form.id
        ? localProducts.map(p => (p.id === form.id ? newProduct : p))
        : [...localProducts, newProduct];
      setLocalProducts(updatedList);
      setProducts(updatedList);
      setForm({ id: null, name: '', description: '', category: '', price: '', quantity: '' });
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  const startEdit = p => setForm(p);

  const remove = async id => {
    const product = localProducts.find(p => p.id === id);
    if (product?.quantity > 0) return alert('Cannot delete — still in stock.');
    if (!window.confirm('Delete permanently?')) return;
    try {
      console.log('Simulating delete:', id);
      const updatedList = localProducts.filter(p => p.id !== id);
      setLocalProducts(updatedList);
      setProducts(updatedList);
      if (form.id === id) setForm({ id: null, name: '', description: '', category: '', price: '', quantity: '' });
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  return (
    <div className="inventory">
      <h2>Product Management</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <input placeholder="Category *" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required />
        <input type="number" placeholder="Price *" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} min="0" step="0.01" required />
        <input type="number" placeholder="Quantity *" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} min="0" required />
        <button type="submit">{form.id ? 'Update' : 'Add'}</button>
        {form.id && <button type="button" onClick={() => setForm({ id: null, name: '', description: '', category: '', price: '', quantity: '' })}>Cancel</button>}
      </form>
      <table>
        <thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Qty</th><th>Action</th></tr></thead>
        <tbody>
          {localProducts.length === 0 ? (
            <tr><td colSpan="5">No products yet. Add one!</td></tr>
          ) : (
            localProducts.map(p => (
              <tr key={p.id} className={p.quantity < 5 ? 'low' : ''}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>M{p.price.toFixed(2)}</td>
                <td style={{ fontWeight: p.quantity === 0 ? 'bold' : 'normal', color: p.quantity === 0 ? '#dc3545' : 'inherit' }}>{p.quantity}</td>
                <td>
                  <button onClick={() => startEdit(p)}>Edit</button>
                  <button onClick={() => remove(p.id)} disabled={p.quantity > 0} style={{ backgroundColor: p.quantity > 0 ? '#ccc' : '#dc3545', color: p.quantity > 0 ? '#666' : 'white', cursor: p.quantity > 0 ? 'not-allowed' : 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}