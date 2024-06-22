import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import App from './App.jsx';
import './index.css';

// context providers
import SearchContextProvider from './context/searchContext.jsx';
import SelectedChatProvider from './context/selectChatContext.jsx';
import SocketContextProvider from './context/socketContext.jsx';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './components/ErrorFallback.jsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 120 * 1000,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.replace('/')}
    >
      <BrowserRouter>
        <Toaster position='top-center' />
        <QueryClientProvider client={queryClient}>
          <SelectedChatProvider>
            <SearchContextProvider>
              <SocketContextProvider>
                <App />
                <ReactQueryDevtools />
              </SocketContextProvider>
            </SearchContextProvider>
          </SelectedChatProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
