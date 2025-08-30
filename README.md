# RBAC Web Application

A simple login-based web application with Role-Based Access Control (RBAC) implemented using Flask backend and React frontend.

## Features

- **Three User Roles**: Admin, Editor, and Viewer with specific permissions
- **Role-Based Access Control**: Different features available based on user role
- **Content Management**: Create, edit, and view content with public/private options
- **Admin Panel**: User management and system statistics (Admin only)
- **Modern UI**: Clean and responsive design with Tailwind-like styling

## User Roles and Permissions

### Admin
- **Email**: admin@example.com
- **Password**: admin123
- **Permissions**: 
  - Manage users
  - View all data
  - Configure settings
  - Create and edit content
  - Access admin panel

### Editor
- **Email**: editor@example.com
- **Password**: editor123
- **Permissions**:
  - Create content
  - Edit own content
  - View content

### Viewer
- **Email**: viewer@example.com
- **Password**: viewer123
- **Permissions**:
  - View content only

## Technology Stack

- **Backend**: Flask (Python)
- **Frontend**: React.js
- **Authentication**: Flask-Login
- **Styling**: Custom CSS (Tailwind-like)
- **HTTP Client**: Axios

## Setup Instructions

### Prerequisites
- Python 3.7+
- Node.js 14+
- npm or yarn

### Backend Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Run the Flask backend:
```bash
python app.py
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Install Node.js dependencies:
```bash
npm install
```

2. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user info

### Content Management
- `GET /api/content` - Get content (filtered by permissions)
- `POST /api/content` - Create new content
- `PUT /api/content/<id>` - Update content

### Admin Only
- `GET /api/users` - Get all users
- `GET /api/admin/stats` - Get system statistics

## Access Control Implementation

### Backend (Flask)
- Uses decorators to check permissions
- Role-based route protection
- Content filtering based on user role

### Frontend (React)
- Route protection based on user permissions
- Conditional rendering of components
- Navigation menu filtered by role

## Key Features Demonstrated

1. **Role-Based Navigation**: Different menu items based on user role
2. **Content Access Control**: Users see different content based on permissions
3. **Admin Panel**: Only accessible to admin users
4. **Content Creation**: Limited to editors and admins
5. **Content Editing**: Users can only edit their own content (except admins)

## Security Features

- Password hashing using Werkzeug
- Session-based authentication
- Permission-based route protection
- Content access filtering
- CORS configuration for frontend-backend communication

## Project Structure

```
Project/
├── app.py                 # Flask backend
├── requirements.txt       # Python dependencies
├── package.json          # Node.js dependencies
├── public/              # React public files
├── src/                 # React source code
│   ├── components/      # React components
│   ├── App.js          # Main app component
│   └── index.js        # React entry point
└── README.md           # This file
```

## Testing the Application

1. Start both backend and frontend servers
2. Navigate to `http://localhost:3000`
3. Login with one of the test accounts
4. Explore different features based on your role

### Test Scenarios

- **Admin**: Can access all features including admin panel
- **Editor**: Can create and edit content, but no admin access
- **Viewer**: Can only view public content
