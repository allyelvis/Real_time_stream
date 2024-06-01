To implement fiscalization for invoice and stock movement with real-time streaming on a REST API endpoint, you can follow these steps:

1. **Define the API Endpoints**:
   - **Invoices**: Endpoint to handle invoice data.
   - **Stock Movements**: Endpoint to manage stock movements.
   - **Real-Time Streaming**: WebSocket or Server-Sent Events (SSE) endpoint to stream real-time data.

2. **Set Up the Backend**:
   - Choose a backend framework (e.g., Node.js, Django, Flask, Spring Boot).
   - Implement the REST API endpoints.

3. **Database Integration**:
   - Use a database (e.g., PostgreSQL, MySQL, MongoDB) to store invoice and stock movement data.
   - Ensure the database supports real-time change data capture (CDC) if you want to stream changes.

4. **Fiscalization Logic**:
   - Implement the logic to comply with local fiscal regulations (e.g., generating fiscal receipts, storing fiscal data).

5. **Real-Time Streaming**:
   - Use WebSockets or Server-Sent Events (SSE) for real-time updates.
   - Ensure clients can subscribe to updates for invoices and stock movements.

6. **Security**:
   - Implement authentication and authorization.
   - Ensure data encryption and secure communication.

### Example Implementation in Node.js

1. **Install Dependencies**:
   ```bash
   npm install express mongoose websocket
   ```

2. **Define the Models**:
   ```javascript
   // models/Invoice.js
   const mongoose = require('mongoose');
   const invoiceSchema = new mongoose.Schema({
       invoiceNumber: String,
       date: Date,
       items: Array,
       totalAmount: Number,
   });
   module.exports = mongoose.model('Invoice', invoiceSchema);

   // models/StockMovement.js
   const mongoose = require('mongoose');
   const stockMovementSchema = new mongoose.Schema({
       productId: String,
       quantity: Number,
       type: String, // 'in' or 'out'
       date: Date,
   });
   module.exports = mongoose.model('StockMovement', stockMovementSchema);
   ```

3. **Set Up the Server**:
   ```javascript
   const express = require('express');
   const mongoose = require('mongoose');
   const Invoice = require('./models/Invoice');
   const StockMovement = require('./models/StockMovement');
   const WebSocket = require('ws');

   const app = express();
   app.use(express.json());

   mongoose.connect('mongodb://localhost:27017/yourdb', { useNewUrlParser: true, useUnifiedTopology: true });

   // REST API endpoints
   app.post('/invoices', async (req, res) => {
       const invoice = new Invoice(req.body);
       await invoice.save();
       res.status(201).send(invoice);
       // Send real-time update
       sendRealTimeUpdate({ type: 'INVOICE_CREATED', data: invoice });
   });

   app.post('/stock-movements', async (req, res) => {
       const stockMovement = new StockMovement(req.body);
       await stockMovement.save();
       res.status(201).send(stockMovement);
       // Send real-time update
       sendRealTimeUpdate({ type: 'STOCK_MOVEMENT_CREATED', data: stockMovement });
   });

   // Real-time streaming using WebSocket
   const wss = new WebSocket.Server({ port: 8080 });

   const sendRealTimeUpdate = (update) => {
       wss.clients.forEach(client => {
           if (client.readyState === WebSocket.OPEN) {
               client.send(JSON.stringify(update));
           }
       });
   };

   wss.on('connection', ws => {
       ws.send(JSON.stringify({ message: 'Connected to real-time updates' }));
   });

   app.listen(3000, () => {
       console.log('Server is running on port 3000');
   });
   ```

### Security and Compliance

1. **Authentication and Authorization**:
   - Use JWT or OAuth for secure access to the endpoints.
   - Ensure only authorized users can access and modify data.

2. **Data Encryption**:
   - Use HTTPS to encrypt data in transit.
   - Encrypt sensitive data at rest in the database.

3. **Audit Logs**:
   - Maintain audit logs for all fiscal transactions to ensure compliance with regulations.

### Monitoring and Maintenance

1. **Set Up Monitoring**:
   - Use tools like Prometheus and Grafana to monitor API performance and database health.
   - Implement logging with tools like Winston or Morgan.

2. **Regular Updates**:
   - Keep dependencies updated to ensure security and performance.
   - Regularly review and update fiscalization logic to comply with any changes in regulations.

By following these steps, you can create a robust system for fiscalizing invoices and managing stock movements with real-time updates via a REST API.
