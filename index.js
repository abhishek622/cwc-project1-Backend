const cors = require('cors');
const paymentRoute = require('./paymentRoute');

const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
// middlewares
app.use(express.json({ extended: false }));

// route included
app.use('/payment', paymentRoute);

app.listen(port, () => console.log(`server started on port ${port}`));
