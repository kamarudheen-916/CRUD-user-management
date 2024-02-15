const express = require('express');
const app = express();
const cors = require('cors')
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes')
const morgan = require('morgan');
const mongo = require('./config/db')
const path = require('path')


app.use(cors({
    origin:'http://localhost:3000'
}))
app.use(morgan('dev')); 
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use('/', userRoutes); 
app.use('/', adminRoutes); 
app.use(express.static(process.cwd() + '/profileImage'))
// Other middleware and routes...




const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
