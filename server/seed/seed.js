/**
 * Seeds the database with demo accounts, restaurants, food items and tables.
 * Run from the server folder:  npm run seed
 * WARNING: this wipes the collections it fills.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const Table = require('../models/Table');
const Reservation = require('../models/Reservation');
const Cart = require('../models/Cart');

const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;

const restaurants = [
  {
    name: 'Saravana Spice House',
    cuisine: 'South Indian',
    address: '12 West Masi Street, Madurai, Tamil Nadu',
    openingHours: '7:00 AM - 11:00 PM',
    description:
      'Banana-leaf meals, filter coffee and dosas cooked on a cast-iron griddle since 1974.',
    image: img('1517248135467-4c7edcad34c4'),
  },
  {
    name: 'The Copper Tandoor',
    cuisine: 'North Indian',
    address: '4 Anna Nagar Main Road, Madurai, Tamil Nadu',
    openingHours: '11:00 AM - 11:30 PM',
    description: 'Clay-oven kebabs, slow-cooked dal and hot breads pulled straight from the tandoor.',
    image: img('1552566626-52f8b828add9'),
  },
  {
    name: 'Harbour & Vine',
    cuisine: 'Continental',
    address: '88 Race Course Road, Madurai, Tamil Nadu',
    openingHours: '12:00 PM - 12:00 AM',
    description: 'A quiet dining room for pastas, grills and long dinners by the courtyard windows.',
    image: img('1414235077428-338989a2e8c0'),
  },
  {
    name: 'Bamboo Lane',
    cuisine: 'Pan Asian',
    address: '25 KK Nagar, Madurai, Tamil Nadu',
    openingHours: '11:30 AM - 10:30 PM',
    description: 'Wok-tossed noodles, dim sum baskets and sticky rice bowls served family style.',
    image: img('1555396273-367ea4eb4db5'),
  },
];

const foodsFor = (r) => {
  const byCuisine = {
    'South Indian': [
      ['Ghee Podi Idli', 'Starter', 120, 'Steamed idli tossed in ghee and spiced lentil powder.', '1589301760014-d929f3979dbc'],
      ['Madurai Mutton Biryani', 'Biryani', 340, 'Seeraga samba rice, slow-cooked mutton, mint and fried onion.', '1563379091339-03b21ab4a4f8'],
      ['Chettinad Chicken Curry', 'Main Course', 290, 'Roasted spice masala with curry leaf and coconut.', '1604908176997-125f25cc6f3d'],
      ['Parotta (2 pcs)', 'Breads', 60, 'Flaky layered parotta, fresh off the tawa.', '1565299624946-b28f40a0ae38'],
      ['Filter Coffee', 'Beverage', 50, 'Strong decoction and hot milk, pulled in a steel tumbler.', '1509042239860-f550ce710b93'],
    ],
    'North Indian': [
      ['Malai Paneer Tikka', 'Starter', 260, 'Cream-marinated paneer charred in the tandoor.', '1546069901-ba9599a7e63c'],
      ['Butter Chicken', 'Main Course', 380, 'Tomato and cashew gravy finished with white butter.', '1600891964092-4316c288032e'],
      ['Dal Makhani', 'Main Course', 240, 'Black lentils simmered overnight on low heat.', '1585937421612-70a008356fbe'],
      ['Garlic Naan', 'Breads', 80, 'Soft naan brushed with garlic and coriander.', '1601050690597-df0568f70950'],
      ['Gulab Jamun', 'Dessert', 110, 'Warm milk dumplings in cardamom syrup.', '1601303516534-bf0b1eb70bd7'],
    ],
    Continental: [
      ['Bruschetta Pomodoro', 'Starter', 220, 'Grilled sourdough, tomato, basil and olive oil.', '1572695157366-5e585ab2b69f'],
      ['Truffle Mushroom Pasta', 'Main Course', 420, 'Fettuccine in a cream and wild mushroom sauce.', '1621996346565-e3dbc646d9a9'],
      ['Grilled Chicken Steak', 'Main Course', 460, 'Herb-buttered chicken with roast vegetables.', '1544025162-d76694265947'],
      ['Garlic Bread Basket', 'Breads', 150, 'Toasted baguette with herb butter.', '1573140247632-f8fd74997d5c'],
      ['Tiramisu', 'Dessert', 200, 'Coffee-soaked sponge layered with mascarpone.', '1571877227200-a0d98ea607e9'],
    ],
    'Pan Asian': [
      ['Chicken Dim Sum', 'Starter', 240, 'Steamed baskets served with chilli oil.', '1563245372-f21724e3856d'],
      ['Thai Green Curry', 'Main Course', 330, 'Coconut curry with basil and seasonal vegetables.', '1455619452474-d2be8b1e70cd'],
      ['Hakka Noodles', 'Main Course', 260, 'Wok-tossed noodles with crunchy vegetables.', '1569718212165-3a8278d5f624'],
      ['Steamed Bao', 'Breads', 190, 'Pillowy buns with a sweet-savoury filling.', '1626082927389-6cd097cee6a6'],
      ['Jasmine Iced Tea', 'Beverage', 120, 'Cold-brewed jasmine tea with lime.', '1556679343-c7306c1976bc'],
    ],
  };
  return (byCuisine[r.cuisine] || []).map(([name, category, price, description, photo]) => ({
    name,
    category,
    price,
    description,
    image: img(photo),
    restaurant: r._id,
    isAvailable: true,
  }));
};

const tablesFor = (r, index) => {
  const photos = [
    '1517248135467-4c7edcad34c4',
    '1592861956120-e524fc739696',
    '1559339352-11d035aa65de',
    '1466978913421-dad2ebd01d17',
    '1424847651672-bf20a4b0982b',
  ];
  const sections = ['Indoor', 'Window Side', 'Garden', 'Private Cabin', 'Rooftop'];
  return [2, 4, 4, 6, 8].map((capacity, i) => ({
    tableNumber: `T${index + 1}${i + 1}`,
    restaurant: r._id,
    capacity,
    section: sections[i],
    image: img(photos[i]),
    isAvailable: !(index === 1 && i === 4), // one table intentionally blocked for demo
  }));
};

(async () => {
  await connectDB();
  try {
    console.log('Clearing old data...');
    await Promise.all([
      User.deleteMany({}),
      Restaurant.deleteMany({}),
      MenuItem.deleteMany({}),
      Table.deleteMany({}),
      Reservation.deleteMany({}),
      Cart.deleteMany({}),
    ]);

    await User.create({
      name: 'Restaurant Admin',
      email: 'admin@restaurant.com',
      password: 'admin123',
      phone: '9876543210',
      role: 'admin',
    });
    await User.create({
      name: 'Anitha Kumar',
      email: 'customer@example.com',
      password: 'customer123',
      phone: '9876500000',
      role: 'customer',
    });

    const createdRestaurants = await Restaurant.insertMany(restaurants);

    let foods = [];
    let tables = [];
    createdRestaurants.forEach((r, i) => {
      foods = foods.concat(foodsFor(r));
      tables = tables.concat(tablesFor(r, i));
    });
    await MenuItem.insertMany(foods);
    await Table.insertMany(tables);

    console.log(`Seeded ${createdRestaurants.length} restaurants, ${foods.length} food items, ${tables.length} tables.`);
    console.log('Admin login    : admin@restaurant.com / admin123');
    console.log('Customer login : customer@example.com / customer123');
  } catch (err) {
    console.error('Seed failed:', err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
})();
