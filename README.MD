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

Step 3 -  Install node packages.Simple enter npm install.then all packages are installed according to package.json file.
          if some packages are not installed then you can install using the error messages.
          
step 5 -  add the .env file in the root directory and create own jwt secrete key and own mongodb configurations and stripe also.
          # Run this command to generate a secure secret:
          node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

step 6 -  Open another terminal

step 7 -  cd Frontend

step 8 -  Install node packages.Simple enter npm install.then all packages are installed according to package.json file.
          if some packages are not installed then you can install using the error messages.

step 9 -add the .env file in the root directory.



### .env Frontend ###
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=pk_test_add_your_public_key
STRIPE_SECRET_KEY=sk_test_addd_your_public_key

### .env Backend ###

NODE_ENV=development


MONGODB_URI=mongodb+srv://addyour:addyour1234@add#your#mongodb#configuration  


JWT_SECRET=add_your_secrete_key
JWT_EXPIRES_IN=15m

EMAIL_SERVICE=gmail
SMTP_USER=addyourgmail@gmail.com
SMTP_PASS=addy ourp assw ords  
SMTP_PORT=587

PORT=5000


