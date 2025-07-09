
# React Frontend Application

## Project Description

This is a React frontend application built with Vite and TypeScript that allows users to log in, browse a list of products, filter and search products, and view detailed information about individual products.  
The app uses JWT authentication and communicates with the backend via REST API.

---

## Technologies and Tools

- React 18 + TypeScript  
- Vite (build tool and development server)  
- React Router DOM for routing  
- SCSS for styling  
- Fetch API for backend communication  
- LocalStorage for storing JWT token  

---

## Key Components Overview

- **LoginPage** – login form with username and password inputs, sends authentication request to backend, stores token, and redirects to `/products`.  
- **ProductsPage** – displays a paginated list of products with category filtering and search by name. Includes logout functionality.  
- **ProductDetailPage** – shows detailed information for a single product including image, price, category, and description.  
- **App** – main router component that protects routes and redirects to login if user is not authenticated.

---

## Installation and Running

1. Clone the repository:

   ```bash
   git clone <REPO_URL>
   cd <project-folder>
Install dependencies:

bash
Copy
Edit
npm install
Create a .env file in the project root with:

ini
Copy
Edit
VITE_API_URL=http://127.0.0.1:5000
For production, create .env.production with your backend URL, for example:

ini
Copy
Edit
VITE_API_URL=https://konovo-backend.onrender.com
Start the development server:

bash
Copy
Edit
npm run dev
The app will be available at:
http://localhost:5173

Deployment
The app is deployed on Vercel and available at:
https://konovo-client.vercel.app/

Features
Authentication: login form sends POST request to /login, stores JWT token in localStorage.

Protected routes: /products and /products/:id are accessible only when logged in.

Product listing: pagination, category filtering, and search functionality.

Product details: displays image, name, price, category, and detailed description.

Logout: clears token and redirects to login page.

Configuration
API requests use the VITE_API_URL environment variable defined in .env files.

JWT token is stored in localStorage under the key token and sent in the Authorization header as Bearer <token>.

Future Improvements and Contributions
Add user registration functionality.

Improve UI/UX design.

Add notifications and better error handling.

Feel free to open issues or pull requests for questions, suggestions, or contributions.

Contact
Author: <Marko>
Email: markostojanovic353@gmail.com
GitHub: <https://github.com/marko353>
