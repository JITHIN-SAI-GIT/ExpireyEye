const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Products');

mongoose.connect(process.env.ATLAS_URL)
  .then(async () => {
    const products = await Product.find({}, 'name category');
    const fs = require('fs');
    fs.writeFileSync('products_list.json', JSON.stringify(products, null, 2));
    console.log("Products saved to products_list.json");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
