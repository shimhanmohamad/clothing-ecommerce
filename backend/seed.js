const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const sampleProducts = [
  {
    name: "Classic White T-Shirt",
    description: "Comfortable 100% cotton t-shirt for everyday wear. Perfect for casual outings or layering.",
    price: 24.99,
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    category: "Men",
    sizes: ["S", "M", "L", "XL"],
    featured: true,
    inStock: true
  },
  {
    name: "Slim Fit Jeans",
    description: "Modern slim fit jeans with stretch for maximum comfort. Perfect for any casual occasion.",
    price: 79.99,
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
    category: "Men",
    sizes: ["S", "M", "L", "XL"],
    featured: true,
    inStock: true
  },
  {
    name: "Denim Jacket",
    description: "Classic denim jacket with a modern fit. Features multiple pockets and durable construction.",
    price: 89.99,
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
    category: "Women",
    sizes: ["S", "M", "L"],
    featured: true,
    inStock: true
  },
  {
    name: "Floral Summer Dress",
    description: "Light and breezy floral dress perfect for summer days. Made from breathable cotton blend.",
    price: 59.99,
    imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500",
    category: "Women",
    sizes: ["S", "M", "L"],
    featured: false,
    inStock: true
  },
  {
    name: "Kids Hoodie",
    description: "Warm and comfortable hoodie for kids. Features a fun design and soft inner lining.",
    price: 34.99,
    imageUrl: "https://images.unsplash.com/photo-1506629905607-e48b0e67d879?w=500",
    category: "Kids",
    sizes: ["S", "M", "L"],
    featured: true,
    inStock: true
  },
  {
    name: "Striped Polo Shirt",
    description: "Classic polo shirt with stylish stripes. Perfect for smart casual occasions.",
    price: 45.99,
    imageUrl: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500",
    category: "Men",
    sizes: ["M", "L", "XL"],
    featured: false,
    inStock: true
  },
  {
    name: "Winter Parka",
    description: "Heavy-duty winter parka with insulation. Stay warm in the coldest weather.",
    price: 199.99,
    imageUrl: "https://images.unsplash.com/photo-1551488831-00ddcb929696?w=500",
    category: "Women",
    sizes: ["S", "M", "L", "XL"],
    featured: true,
    inStock: true
  },
  {
    name: "Kids Jogger Pants",
    description: "Comfortable jogger pants for active kids. Elastic waistband for easy wear.",
    price: 29.99,
    imageUrl: "https://images.unsplash.com/photo-1506629905607-e48b0e67d879?w=500",
    category: "Kids",
    sizes: ["S", "M", "L"],
    featured: false,
    inStock: true
  },
  {
    name: "Leather Biker Jacket",
    description: "Genuine leather biker jacket with multiple zippers. Timeless style and durability.",
    price: 299.99,
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
    category: "Men",
    sizes: ["M", "L", "XL"],
    featured: true,
    inStock: true
  },
  {
    name: "Evening Gown",
    description: "Elegant evening gown for special occasions. Flowing design with delicate details.",
    price: 149.99,
    imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500",
    category: "Women",
    sizes: ["S", "M", "L"],
    featured: false,
    inStock: true
  },
  {
    name: "Graphic T-Shirt",
    description: "Cotton t-shirt with unique graphic print. Express your style with this trendy top.",
    price: 32.99,
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    category: "Men",
    sizes: ["S", "M", "L", "XL"],
    featured: false,
    inStock: true
  },
  {
    name: "Yoga Pants",
    description: "High-waisted yoga pants with four-way stretch. Perfect for workouts or casual wear.",
    price: 49.99,
    imageUrl: "https://images.unsplash.com/photo-1506629905607-e48b0e67d879?w=500",
    category: "Women",
    sizes: ["S", "M", "L"],
    featured: true,
    inStock: true
  },
  {
    name: "Kids T-Shirt Pack",
    description: "Pack of 3 colorful t-shirts for kids. Made from soft, breathable cotton.",
    price: 39.99,
    imageUrl: "https://images.unsplash.com/photo-1506629905607-e48b0e67d879?w=500",
    category: "Kids",
    sizes: ["S", "M", "L"],
    featured: false,
    inStock: true
  },
  {
    name: "Business Shirt",
    description: "Formal business shirt with classic fit. Perfect for office wear or formal events.",
    price: 69.99,
    imageUrl: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500",
    category: "Men",
    sizes: ["S", "M", "L", "XL"],
    featured: false,
    inStock: true
  },
  {
    name: "Knit Sweater",
    description: "Warm knit sweater for chilly days. Features a comfortable fit and soft texture.",
    price: 79.99,
    imageUrl: "https://images.unsplash.com/photo-1551488831-00ddcb929696?w=500",
    category: "Women",
    sizes: ["S", "M", "L"],
    featured: true,
    inStock: true
  },
  {
    name: "Cargo Shorts",
    description: "Practical cargo shorts with multiple pockets. Great for outdoor activities.",
    price: 44.99,
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
    category: "Men",
    sizes: ["M", "L", "XL"],
    featured: false,
    inStock: true
  },
  {
    name: "Summer Skirt",
    description: "Light and flowy summer skirt. Perfect for warm weather and beach vacations.",
    price: 39.99,
    imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500",
    category: "Women",
    sizes: ["S", "M", "L"],
    featured: false,
    inStock: true
  },
  {
    name: "Kids Winter Jacket",
    description: "Warm winter jacket for kids. Water-resistant and insulated for cold weather.",
    price: 64.99,
    imageUrl: "https://images.unsplash.com/photo-1506629905607-e48b0e67d879?w=500",
    category: "Kids",
    sizes: ["S", "M", "L"],
    featured: true,
    inStock: true
  },
  {
    name: "Blazer",
    description: "Classic blazer for formal occasions. Tailored fit with premium fabric.",
    price: 129.99,
    imageUrl: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500",
    category: "Men",
    sizes: ["S", "M", "L", "XL"],
    featured: true,
    inStock: true
  },
  {
    name: "Maxi Dress",
    description: "Elegant maxi dress with flowing design. Perfect for special occasions.",
    price: 89.99,
    imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500",
    category: "Women",
    sizes: ["S", "M", "L"],
    featured: false,
    inStock: true
  }
];

const seedDatabase = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    
    // Connect to MongoDB - UPDATED for mongoose 7+
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clothing_ecommerce');
    console.log('✅ MongoDB Connected');
    
    console.log('🗑️ Clearing existing products...');
    const deleteResult = await Product.deleteMany({});
    console.log(`✅ Removed ${deleteResult.deletedCount} existing products`);

    console.log('🌱 Inserting sample products...');
    const result = await Product.insertMany(sampleProducts);
    console.log(`✅ Successfully seeded ${result.length} products into the database!`);

    // Display statistics
    const menProducts = await Product.countDocuments({ category: 'Men' });
    const womenProducts = await Product.countDocuments({ category: 'Women' });
    const kidsProducts = await Product.countDocuments({ category: 'Kids' });
    const featuredProducts = await Product.countDocuments({ featured: true });

    console.log('\n📊 Database Statistics:');
    console.log(`👕 Men's Products: ${menProducts}`);
    console.log(`👚 Women's Products: ${womenProducts}`);
    console.log(`👶 Kids' Products: ${kidsProducts}`);
    console.log(`⭐ Featured Products: ${featuredProducts}`);
    
    const prices = sampleProducts.map(p => p.price);
    console.log(`💰 Price Range: $${Math.min(...prices)} - $${Math.max(...prices)}`);

    // Close connection
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

// Run the seeder if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { sampleProducts, seedDatabase };