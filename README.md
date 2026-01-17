# 🛒 ShopKart Admin Panel

A powerful and intuitive admin dashboard for managing the ShopKart e-commerce platform. Built with React, Vite, and TailwindCSS with DaisyUI components.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![DaisyUI](https://img.shields.io/badge/DaisyUI-5A0EF8?style=for-the-badge&logo=daisyui&logoColor=white)

## ✨ Features

### 📊 Dashboard
- **Overview Stats** - Total revenue, orders, products, customers
- **Recent Orders** - Quick view of latest orders
- **Revenue Charts** - Visual analytics (coming soon)

### 📦 Product Management
- **Add Products** - Create new products with images
- **Edit Products** - Update product details, pricing, stock
- **Delete Products** - Remove products from catalog
- **Image Upload** - Multiple product images via Cloudinary
- **Stock Management** - Track and update inventory

### 🛍️ Order Management
- **Order List** - View all orders with filters
- **Order Details** - Full order information with items
- **Status Updates** - Update order status (Pending → Shipped → Delivered)
- **Email Notifications** - Automatic emails on status change
- **Order Timeline** - Visual order progress tracking

### 👥 Customer Management
- **Customer List** - View all registered customers
- **Customer Details** - Profile info, order history
- **Search & Filter** - Find customers easily

### 🎫 Support Tickets
- **Ticket List** - View all support tickets
- **Ticket Details** - Full issue description
- **Mark Resolved** - Resolve tickets with email notification
- **Filter by Status/Type** - Pending, resolved, by category

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nawneetgupta7479/e-commerce-admin.git
   cd e-commerce-admin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=https://your-backend-url.com/api
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

## 📁 Project Structure

```
admin/
├── src/
│   ├── components/           # Reusable components
│   │   ├── Navbar.jsx       # Navigation bar
│   │   ├── Sidebar.jsx      # Side navigation
│   │   ├── PageLoader.jsx   # Loading spinner
│   │   └── orders/          # Order components
│   │       ├── OrderCard.jsx
│   │       ├── OrderTableRow.jsx
│   │       ├── OrderFilters.jsx
│   │       ├── OrderStatusBadge.jsx
│   │       ├── OrderStatusSelect.jsx
│   │       ├── OrderItemCard.jsx
│   │       ├── OrderShippingInfo.jsx
│   │       ├── OrderPaymentInfo.jsx
│   │       └── OrderTimeline.jsx
│   ├── layouts/
│   │   └── DashboardLayout.jsx
│   ├── pages/
│   │   ├── DashboardPage.jsx
│   │   ├── ProductsPage.jsx
│   │   ├── OrdersPage.jsx
│   │   ├── OrderDetailsPage.jsx
│   │   ├── CustomersPage.jsx
│   │   ├── IssuesPage.jsx
│   │   └── LoginPage.jsx
│   ├── lib/
│   │   ├── api.js           # API functions
│   │   ├── axios.js         # Axios instance
│   │   └── utils.js         # Helper functions
│   ├── App.jsx              # Main app with routes
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── public/                   # Static assets
├── tailwind.config.js       # Tailwind configuration
├── vite.config.js           # Vite configuration
└── package.json
```

## 🔧 Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI library |
| **Vite** | Build tool & dev server |
| **React Router** | Client-side routing |
| **TanStack Query** | Server state management |
| **Tailwind CSS** | Utility-first CSS |
| **DaisyUI** | Component library |
| **Clerk** | Admin authentication |
| **Axios** | HTTP client |
| **Lucide React** | Icon library |

## 📱 Pages

### Dashboard (`/dashboard`)
Overview of store performance with key metrics and recent activity.

### Products (`/products`)
Full CRUD operations for product management:
- Add new products with multiple images
- Edit existing products
- Delete products
- Manage stock levels

### Orders (`/orders`)
Order management with advanced features:
- Filter by status (Pending, Shipped, Delivered)
- Click to view order details
- Update order status
- Automatic email notifications

### Order Details (`/orders/:orderId`)
Comprehensive order view:
- Customer information
- Order items with images
- Shipping address
- Payment details
- Order timeline

### Customers (`/customers`)
Customer management:
- View all customers
- Customer order history
- Search functionality

### Support Tickets (`/issues`)
Support ticket management:
- View all tickets
- Filter by status and type
- Mark as resolved
- Email notifications

## 🔐 Authentication

Admin authentication is handled by [Clerk](https://clerk.com/):

- Secure admin-only access
- Session management
- Role-based access control

**Note:** Only users with admin role can access the dashboard.

## 📧 Email Notifications

The admin panel triggers email notifications for:

| Action | Email Sent To |
|--------|---------------|
| Order status updated | Customer |
| Ticket resolved | Customer |

## 🎨 Theming

The admin panel uses DaisyUI themes. Default theme is `night` with customizable options.

To change theme, update `tailwind.config.js`:

```javascript
daisyui: {
  themes: ["night", "light", "dark", "cupcake"],
},
```

## 🧪 Development

### Running locally

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Linting

```bash
# Run ESLint
npm run lint
```

## 📦 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy

### Manual Build

```bash
# Build
npm run build

# Output in dist/ folder
```

## 🔗 API Endpoints Used

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/admin/products` | GET, POST | List/Create products |
| `/admin/products/:id` | PUT, DELETE | Update/Delete product |
| `/admin/orders` | GET | List all orders |
| `/admin/orders/:id` | GET | Get order details |
| `/admin/orders/:id/status` | PATCH | Update order status |
| `/admin/customers` | GET | List all customers |
| `/admin/issues` | GET | List all issues |
| `/admin/issues/:id/resolve` | PATCH | Resolve issue |
| `/admin/stats` | GET | Dashboard statistics |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Nawneet Kumar Gupta**
- GitHub: [@nawneetgupta7479](https://github.com/nawneetgupta7479)

---

<p align="center">Made with ❤️ by Nawneet Kumar Gupta</p>