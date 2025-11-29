###### FashionStore - E-Commerce Clothing Platform #######

A full-stack MERN e-commerce application for a clothing brand with user authentication, product catalog, shopping cart, and order management.


🌟 Features

1 - User Authentication - Register, login with JWT

2 - Product Catalog - Browse clothing items with search, filters, pagination

3 - Shopping Cart - Add items (with sizes), update quantities, guest cart support

4 - Checkout & Orders - Mock checkout process with order confirmation

5 - Order Management - View order history and details

6 - Email Notifications - Order confirmation emails using Nodemailer

🛠️ Tech Stack

### Frontend ###

1 - React.js with Hooks

2 - Tailwind CSS for styling

3 - React Router for navigation

4 - Axios for API calls

### Backend ###

1 - Node.js with Express.js

2 - MongoDB with Mongoose

3 - JWT for authentication

4 - bcryptjs for password hashing

5 - Nodemailer for email service

🚀 Quick Start

#### Prerequisites ###

1 - Node.js (v14 or higher)

2 - MongoDB (Local or Atlas)

3 - Git

####  After Clone the Clothing-Ecommerce Repository  ###
Step 1 -  Open the Clothing-Ecommerce in the Code Editor (VS Code prefered)
Step 2 -  cd Backend
Step 3 - Install node packages.Simple enter npm install.then all packages are installed according to package.json file.
         if some packages are not installed then you can install using the error messages.
step 4 - Open another terminal
step 5 - cd Frontend
step 5 - Install node packages.Simple enter npm install.then all packages are installed according to package.json file.
         if some packages are not installed then you can install using the error messages.


### .env Frontend ###
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=pk_test_51S5PkcEnC4L5QwU6rkUoyvBqOCzWYx8CRSEs95nde1jOZ2XxaAPYQ62riaEB0X1PrjJpBzh8EOdTMk8H9wz4ISwY00iK4x8E1W
STRIPE_SECRET_KEY=sk_test_51S5PkcEnC4L5QwU68nfz5jIkTCsBIzQPfd7krY7XqjjHEIIlYYWvRwDsnSXsuNF1LRkas5DzmNsqKAxzMeBpKGeg000GjUCSGO

### .env Backend ###

# Environment
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://shimhan:shim1234@cluster0.jdcirbl.mongodb.net/clothing_ecommerce?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=242dc61dd18e9bcade1f4f4e14506fb2d03b38a150c2fe3c722710559e52a81d
JWT_EXPIRES_IN=15m


# Email Configuration (for Nodemailer)
EMAIL_SERVICE=gmail
SMTP_USER=shimhan2001@gmail.com
SMTP_PASS=eogp wqtw esph oikt  
SMTP_PORT=587

# Server Configuration
PORT=5000


STRIPE_SECRET_KEY=sk_test_51S5PkcEnC4L5QwU68nfz5jIkTCsBIzQPfd7krY7XqjjHEIIlYYWvRwDsnSXsuNF1LRkas5DzmNsqKAxzMeBpKGeg000GjUCSGO
