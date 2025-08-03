# Email Sorter Frontend

An Angular-based frontend application that provides a clean and intuitive interface for managing multiple Gmail accounts and organizing emails into categories.

## 🏗️ Architecture

### Core Components

- **Authentication**: Google OAuth2 integration for login and account connection
- **Gmail Account Management**: Add and sync multiple Gmail accounts
- **Email Categories**: View and manage email categories
- **Dashboard**: Overview of email organization status

### Key Features

#### Multi-Account Dashboard
- View all connected Gmail accounts
- Individual and bulk sync operations
- Last sync status tracking
- Real-time sync status indicators

#### Category Management
- Create categories
- View emails per category

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- Angular CLI
- Backend service running

### Environment Setup
```env
# src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api/v1'
};

# src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://your-backend-url/api/v1'
};
```

### Installation
```bash
# Install dependencies
npm install

# Start development server
ng serve

# Build for production
ng build --configuration=production
```

## 🎨 UI Components

- Material Design components
- Responsive layout
- Loading indicators for async operations
- Error handling and user feedback

## 📚 Dependencies

- Angular Material: UI components
- RxJS: Reactive programming
- Angular Router: Navigation
- HttpClient: API communication

## 🚀 Deployment

Currently deployed on Netlify with:
- Automatic deployments from main branch
- Environment-specific configuration
- SPA routing configuration
