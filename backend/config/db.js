const mongoose = require('mongoose')
const connectionString = 'mongodb://127.0.0.1:27017/userManagement';
console.log('test ----');
mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
})
.then(()=>console.log('mongodb----connected'))
.catch((error)=>console.log('mongodb--error:',error))

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('Error connecting to MongoDB:', err);
});

module.exports

