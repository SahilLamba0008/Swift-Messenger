import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';
import ChatProvider from './Context/ChatProvider';
import { BrowserRouter as Router } from 'react-router-dom';

// Wrap the rendering logic in a DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <Router>
      <ChakraProvider>
        <ChatProvider>
          <App />
        </ChatProvider>
      </ChakraProvider>
    </Router>,
  );
});
