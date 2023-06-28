const mongoose = require('mongoose');
const env = require('./environment');

async function main() {
  await mongoose.connect(env.db);
}
main().then(()=>{
    console.log('Connected to the database')
}).catch((error)=>{
    console.log(`Error connecting to the database. n${error}`)
})

const db = mongoose.connection

module.exports = db