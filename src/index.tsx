import React from 'react';
import ReactDOM from 'react-dom/client'; // Import the new API
import './mock'; // Include mock API
import './styles/index.scss'; // Include styles
import App from './components/App'; // Include application component

// Get the root element from the DOM
const rootElement = document.getElementById('root');

// Ensure the root element exists and create the React root
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement); // Use createRoot instead of render
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}
