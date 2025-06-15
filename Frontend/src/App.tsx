import React, { Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './assets/css/style.css'

// Pages
const Registration = React.lazy(() => import('./views/auth/Registration'));
const Login = React.lazy(() => import('./views/auth/Login'));
const ForgotPassword = React.lazy(() => import('./views/auth/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./views/auth/ResetPassword'));
const Topics = React.lazy(() => import('./views/Topics'));
const Quiz = React.lazy(() => import('./views/Quiz'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
    },
  },
}); 

function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <ReactQueryDevtools initialIsOpen={false} />
    <BrowserRouter>
      <Suspense 
      // fallback={<div className="pt-3 text-center">Loading...</div>}
      >
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/choose-topics" element={<Topics />} />
          <Route path="/quiz" element={<Quiz />} />

          {/* Admin Routes */}
          {/* {routes.map((route, idx) => (
            route.element && (
              <Route
                key={idx}
                path={route.path}
                exact={route.exact}
                element={route.element}
              />
            )
          ))} */}
        </Routes>
      </Suspense>
    </BrowserRouter>
  </QueryClientProvider>
  )
}

export default App
