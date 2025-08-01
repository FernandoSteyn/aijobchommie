// Global error handler for the application
class ErrorHandler {
  constructor() {
    this.setupGlobalHandlers();
    this.errorQueue = [];
    this.maxRetries = 3;
  }

  setupGlobalHandlers() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      this.logError({
        type: 'unhandledRejection',
        error: event.reason,
        timestamp: new Date().toISOString()
      });
      event.preventDefault();
    });

    // Handle general errors
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
      this.logError({
        type: 'globalError',
        error: event.error,
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        timestamp: new Date().toISOString()
      });
    });
  }

  async logError(errorData) {
    // Store error locally
    this.errorQueue.push(errorData);
    
    // Store in localStorage for persistence
    try {
      const errors = JSON.parse(localStorage.getItem('ajc_errors') || '[]');
      errors.push(errorData);
      // Keep only last 50 errors
      if (errors.length > 50) {
        errors.shift();
      }
      localStorage.setItem('ajc_errors', JSON.stringify(errors));
    } catch (e) {
      console.error('Failed to store error locally:', e);
    }

    // Send to backend when online
    if (navigator.onLine) {
      this.sendErrorsToBackend();
    }
  }

  async sendErrorsToBackend() {
    if (this.errorQueue.length === 0) return;

    const errors = [...this.errorQueue];
    this.errorQueue = [];

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/errors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ajc_token')}`
        },
        body: JSON.stringify({ errors })
      });

      if (!response.ok) {
        // Put errors back in queue if sending failed
        this.errorQueue.unshift(...errors);
      }
    } catch (error) {
      // Put errors back in queue if sending failed
      this.errorQueue.unshift(...errors);
      console.error('Failed to send errors to backend:', error);
    }
  }

  // Retry failed operations with exponential backoff
  async retryOperation(operation, retries = this.maxRetries) {
    for (let i = 0; i < retries; i++) {
      try {
        return await operation();
      } catch (error) {
        if (i === retries - 1) throw error;
        // Exponential backoff: 1s, 2s, 4s
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }

  // Handle network errors gracefully
  handleNetworkError(error) {
    const isOffline = !navigator.onLine;
    
    if (isOffline) {
      return {
        error: true,
        message: 'You are offline. Please check your internet connection.',
        offline: true
      };
    }

    if (error.response) {
      // Server responded with error
      switch (error.response.status) {
        case 401:
          // Unauthorized - redirect to login
          localStorage.removeItem('ajc_token');
          window.location.href = '/login';
          break;
        case 403:
          return {
            error: true,
            message: 'You do not have permission to perform this action.'
          };
        case 404:
          return {
            error: true,
            message: 'The requested resource was not found.'
          };
        case 429:
          return {
            error: true,
            message: 'Too many requests. Please try again later.'
          };
        case 500:
        case 502:
        case 503:
        case 504:
          return {
            error: true,
            message: 'Server error. Please try again later.',
            retry: true
          };
        default:
          return {
            error: true,
            message: error.response.data?.message || 'An error occurred. Please try again.'
          };
      }
    } else if (error.request) {
      // Request made but no response
      return {
        error: true,
        message: 'No response from server. Please check your connection.',
        retry: true
      };
    } else {
      // Something else happened
      return {
        error: true,
        message: error.message || 'An unexpected error occurred.'
      };
    }
  }

  // Clear error logs
  clearErrors() {
    this.errorQueue = [];
    localStorage.removeItem('ajc_errors');
  }

  // Get error history
  getErrorHistory() {
    try {
      return JSON.parse(localStorage.getItem('ajc_errors') || '[]');
    } catch {
      return [];
    }
  }
}

// Create singleton instance
const errorHandler = new ErrorHandler();

// Listen for online/offline events
window.addEventListener('online', () => {
  errorHandler.sendErrorsToBackend();
});

export default errorHandler;
