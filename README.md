# Email Sorter Frontend

An Angular-based frontend application that provides a clean and intuitive interface for managing multiple Gmail accounts, organizing emails into categories, and automating unsubscribe processes.

## 👋 Hey There!

This is my frontend implementation for the email sorter challenge! Built with Angular and Material Design, it provides a smooth user experience for managing your email organization. The app is deployed on Netlify for easy access.

## 🏗️ Core Features

- **Multi-Account Management**
  - Connect multiple Gmail accounts
  - Real-time sync status tracking
  - Individual account settings

- **Email Organization**
  - AI-powered categorization
  - Custom category creation
  - Bulk email operations
  - Email content preview

- **Unsubscribe Automation**
  - One-click unsubscribe requests
  - Real-time status tracking (Unsubscribing..., Unsubscribed, Failed)
  - Visual status indicators
  - Bulk unsubscribe support

## 🎨 Technical Stack

- **Framework**: Angular with TypeScript
- **UI**: Angular Material components
- **State Management**: RxJS
- **Deployment**: Netlify with automatic deployments

## ⚠️ Limitations & Future Improvements

While the core functionality is implemented, there are some areas that could be enhanced:

- Real-time updates could use WebSocket instead of polling
- More detailed error handling for unsubscribe failures
- Batch operations could have better progress indicators
- Mobile responsiveness could be improved
- Loading states could be more granular
- Unit and E2E tests could be expanded
