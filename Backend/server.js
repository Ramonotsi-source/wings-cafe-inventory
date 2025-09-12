const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(express.json());

// 👇 THIS IS THE ONLY THING THAT MATTERS — ADD IT BACK
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const DATA_FILE = path.join(__dirname, 'data.json');

const loadData = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    const defaultData = { customers: [], products: [], sales: [] };
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
};

const saveData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

let db = loadData();

app.get('/customers', (req, res) => res.json(db.customers));
app.post('/customers', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email required' });
  const newCustomer = { id: Date.now(), name, email };
  db.customers.push(newCustomer);
  saveData(db);
  res.status(201).json(newCustomer);
});

app.get('/products', (req, res) => res.json(db.products));
app.post('/products', (req, res) => {
  const { name, description, category, price, quantity } = req.body;
  if (!name || !category || price == null || quantity == null) 
    return res.status(400).json({ error: 'Missing required fields' });
  const newProduct = {
    id: Date.now(),
    name,
    description: description || '',
    category,
    price: +price,
    quantity: +quantity
  };
  db.products.push(newProduct);
  saveData(db);
  res.status(201).json(newProduct);
});

app.get('/sales', (req, res) => res.json(db.sales));
app.post('/sales', (req, res) => {
  const { productId, name, quantity, customerId, customerName, date } = req.body;
  if (!productId || !name || quantity == null || !customerId || !customerName || !date) 
    return res.status(400).json({ error: 'Incomplete sale data' });
  const newSale = {
    id: Date.now(),
    productId,
    name,
    quantity: +quantity,
    customerId,
    customerName,
    date
  };
  db.sales.push(newSale);
  saveData(db);
  res.status(201).json(newSale);
});

app.delete('/customers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = db.customers.findIndex(c => c.id === id);
  if (index === -1) return res.status(404).json({ error: 'Customer not found' });
  db.customers.splice(index, 1);
  saveData(db);
  res.status(204).send();
});

app.delete('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = db.products.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: 'Product not found' });
  db.products.splice(index, 1);
  saveData(db);
  res.status(204).send();
});

app.put('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = db.products.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: 'Product not found' });
  const { name, description, category, price, quantity } = req.body;
  db.products[index] = {
    ...db.products[index],
    name: name || db.products[index].name,
    description: description !== undefined ? description : db.products[index].description,
    category: category || db.products[index].category,
    price: price != null ? +price : db.products[index].price,
    quantity: quantity != null ? +quantity : db.products[index].quantity
  };
  saveData(db);
  res.status(200).json(db.products[index]);
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`💾 Data persisted to: ${DATA_FILE}`);
});