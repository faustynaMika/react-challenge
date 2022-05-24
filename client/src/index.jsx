import React from 'react';
import ReactDOM from 'react-dom';

import { QueryClient, QueryClientProvider } from 'react-query';
import { SnackbarProvider } from 'notistack';

import './index.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import App from './App';
import Slide from '@material-ui/core/Slide';

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider
        maxSnack={3}
        autoHideDuration={5000}
        TransitionComponent={Slide}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <App />
      </SnackbarProvider>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
