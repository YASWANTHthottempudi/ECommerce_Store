# E-Commerce Gaming Platform - Microservices Architecture

> A scalable, production-ready e-commerce platform for gaming products built with MERN stack and microservices architecture.


## About the Project

This is a full-stack e-commerce platform specializing in gaming products, designed with **microservices architecture** principles to ensure scalability, maintainability, and high availability. The application demonstrates modern software engineering practices including service-oriented architecture, JWT authentication, RESTful API design, and containerization.

### What Makes This Project Stand Out?

- ✅ **Microservices Architecture**: Independent, scalable services for User, Product, and Cart management
- ✅ **Modern Tech Stack**: MERN (MongoDB, Express.js, React, Node.js) with TypeScript
- ✅ **Production-Ready Features**: JWT authentication, error handling, input validation
- ✅ **Containerization**: Docker support for easy deployment and scalability


---

##  Problem Statement

Traditional monolithic e-commerce applications face several critical challenges:

1. **Scalability Issues**: Monolithic architectures struggle to scale individual components independently
2. **Technology Constraints**: Difficult to adopt different technologies for different features
3. **Deployment Complexity**: Single deployment unit requires redeploying entire application for small changes
4. **Team Collaboration**: Large teams working on a monolith face merge conflicts and deployment bottlenecks
5. **Failure Isolation**: A failure in one component can bring down the entire system

### Our Solution

This project implements a **microservices architecture** that addresses these challenges by:

- **Independent Services**: Each service (User, Product, Cart) can be developed, deployed, and scaled independently
- **Technology Flexibility**: Services can use different technologies based on requirements
- **Fault Isolation**: Failures in one service don't cascade to others
- **Team Autonomy**: Different teams can work on different services simultaneously
- **Horizontal Scalability**: Scale individual services based on demand (e.g., Cart service during peak shopping hours)

---

## Solution Architecture

The application is built using a **microservices architecture** pattern with three core services:

### Service Breakdown

1. **User Service** (Port 3001)
   - User registration and authentication
   - JWT token generation and validation
   - User profile management
   - Password hashing with bcrypt

2. **Product Service** (Port 3002)
   - Product catalog management
   - Product search and filtering
   - Category-based filtering
   - Price-based filtering

3. **Cart Service** (Port 3003)
   - Shopping cart management
   - Add/remove products
   - Checkout functionality
   - Cart total calculation

4. **Frontend Application** (Port 5173)
   - React-based single-page application
   - TypeScript for type safety
   - Responsive UI with Bootstrap
   - State management with React Hooks

---


##  Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcrypt
- **Language**: JavaScript (ES6+)

### Frontend
- **Framework**: React 18.2
- **Language**: TypeScript 4.9
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Styling**: Bootstrap 5, Custom CSS
- **State Management**: React Hooks (useState, useEffect)

### DevOps & Tools
- **Containerization**: Docker, Docker Compose
- **Version Control**: Git
- **Package Manager**: npm
- **Development**: Nodemon (hot reload)

### Architecture Patterns
- Microservices Architecture
- RESTful API Design
- Service-Oriented Architecture (SOA)
- Stateless Authentication
- Separation of Concerns

---

## 🏛️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + TypeScript)            │
│                         Port: 5173                          │
└─────────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│ User Service  │  │Product Service│  │ Cart Service  │
│  Port: 3001   │  │  Port: 3002   │  │  Port: 3003   │
├───────────────┤  ├───────────────┤  ├───────────────┤
│ • Auth        │  │ • Products    │  │ • Cart Ops    │
│ • Register    │  │ • Filter      │  │ • Checkout    │
│ • Login       │  │ • Search      │  │               │
└───────┬───────┘  └───────┬───────┘  └───────┬───────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                           ▼
                   ┌───────────────┐
                   │   MongoDB     │
                   │   Database    │
                   └───────────────┘
```

### Request Flow

1. **User Registration/Login Flow**:
   ```
   Frontend → User Service → MongoDB → JWT Token → Frontend (localStorage)
   ```

2. **Product Browsing Flow**:
   ```
   Frontend → Product Service → MongoDB → Product List → Frontend
   ```

3. **Add to Cart Flow**:
   ```
   Frontend (with JWT) → Cart Service (validates JWT) → MongoDB → Success Response
   ```

4. **Checkout Flow**:
   ```
   Frontend → Cart Service (validates JWT) → Clear Cart → MongoDB → Success
   ```

### Authentication Flow

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ 1. POST /users/login
       ▼
┌─────────────┐
│ User Service│
└──────┬──────┘
       │ 2. Validate Credentials
       ▼
┌─────────────┐
│  MongoDB    │
└──────┬──────┘
       │ 3. Return User Data
       ▼
┌─────────────┐
│ User Service│
└──────┬──────┘
       │ 4. Generate JWT Token
       ▼
┌─────────────┐
│   Client    │ (Stores token in localStorage)
└─────────────┘
```

---


### User Service API (Port 3001)

#### Register User
```
POST /users
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "age": 25,
  "phone": "1234567890",
  "gender": "male"
}

Response: 201
{
  "message": "User registered successfully",
  "userId": "..."
}
```

#### Login
```
POST /users/login
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200
{
  "token": "jwt_token_here"
}
```

#### Get User Profile
```
GET /users
Authorization: Bearer <token>

Response: 200
{
  "_id": "...",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  ...
}
```

### Product Service API (Port 3002)

#### Get All Products
```
GET /products

Response: 200
[
  {
    "_id": "...",
    "name": "Game Name",
    "price": 59.99,
    "description": "...",
    "category": "Action",
    "image": "..."
  },
  ...
]
```

#### Get Product by ID/Name
```
GET /products/:idOrName

Response: 200
{
  "_id": "...",
  "name": "Game Name",
  ...
}
```

#### Filter by Category
```
GET /filter/category/:category

Response: 200
{
  "filteredProducts": [...]
}
```

#### Create Product
```
POST /products
Content-Type: application/json

Body:
{
  "name": "New Game",
  "price": 49.99,
  "description": "...",
  "category": "Adventure",
  "image": "..."
}
```

### Cart Service API (Port 3003)

#### Get Cart Items
```
GET /cart
Authorization: Bearer <token>

Response: 200
{
  "Products": [...],
  "total": 149.98
}
```

#### Add Product to Cart
```
POST /cart/:productid
Authorization: Bearer <token>

Response: 201
{
  "message": "Product added to cart",
  "cartProduct": {...}
}
```

#### Remove Product from Cart
```
DELETE /cart/:productid
Authorization: Bearer <token>

Response: 200
{
  "message": "Product removed from cart",
  "cartProduct": {...}
}
```

#### Checkout (Clear Cart)
```
DELETE /cart/checkout
Authorization: Bearer <token>

Response: 200
{
  "message": "Checkout successful",
  "deletedCount": 3
}
```

---

