import React, { useState } from 'react';
import Input from '../../components/ui/Input';
import type { FormData } from "../../types";
import { Link, useNavigate } from 'react-router-dom';
import { base_url } from '../../utils/apiFetch';

type Errors = {
  username?: string;
  password?: string;
  submit?: string;
};

type Status = {
  success: boolean | null;
};

const Login: React.FC = () => {
  const navigate = useNavigate();

  // Only keep fields you use in the form
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    username: '',
    email: '',
    password: ''
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<Errors>({});
    const [status, setStatus] = useState<Status>({ success: null });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage({});
    setStatus({ success: null });

    setIsSubmitting(true);

    const submitData = {
      username: formData.username,
      password: formData.password,
    };

    try {
      const response = await fetch(`${base_url}/api/users/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (response.ok) {
       setStatus({ success: true });
        console.log("Login successful!", result);
      
        // Navigate to login page on success
        navigate('/choose-topics'); 
      } else {
        setStatus({ success: false });
        setErrorMessage(result.detail || 'Login failed. Please check your credentials.');
      }
    } catch (error: any) {
      setErrorMessage(error?.message || String(error) || 'Something went wrong during login.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden flex flex-col lg:flex-row">
      {/* Left Side - Branding */}
      <div className="w-full lg:w-1/2 relative min-h-[40vh] lg:min-h-full">
        <div className="absolute inset-0 bg-gradient-to-br from-[#130122] via-[#2D1B69] to-[#3d1a6b] hidden lg:block"></div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#F59E0B] bg-clip-text text-transparent mb-4">
              DIGICHAMP
            </h1>
          </div>
        </div>
        <div className="absolute inset-0 opacity-50">
          <div className="w-full h-full bg-gradient-to-t from-purple-600/20 to-transparent"></div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 bg-white dark:bg-gray-900 overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-md">
            <div className="text-start mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome back</h2>
              <p className="text-gray-600 dark:text-gray-400">Enter your credentials to access your account</p>
            </div>

            {/* Account Type Selector (optional) */}
            {/* 
            <div className="flex justify-center space-x-6 mb-6">
              {(['student', 'administrator'] as AccountType[]).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedAccountType(type)}
                  className={`px-6 py-2 rounded-lg font-semibold transition ${
                    selectedAccountType === type
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
            */}
            {status.success && (
              <p className="text-green-600 text-sm font-medium">
                Login successful! Redirecting...
              </p>
            )}

            {status.success === false && errorMessage.submit && (
              <p className="text-red-600 text-sm font-medium">
                 {errorMessage.submit}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <Input
                label="Username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                icon={
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                }
              />

              <div className="relative">
                <Input
                  label="Password"
                  name="password"
                  type={isPasswordVisible ? 'text' : 'password'}
                  placeholder="••••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  icon={
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                  }
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible(v => !v)}
                  className="absolute right-3 top-[38px] text-gray-600 dark:text-gray-400 focus:outline-none"
                  aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                  name="toggle-password-visibility"
                >
                  {isPasswordVisible ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.418 0-8-3.582-8-8a7.963 7.963 0 012.1-5.26m3.53 3.53a3 3 0 104.24 4.24"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 01-3 3"/>
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.27 2.943 9.542 7-1.272 4.06-5.064 7-9.542 7-4.477 0-8.268-2.94-9.542-7z"/>
                    </svg>
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-lg text-white font-semibold text-base focus:outline-none focus:ring-4 ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] hover:from-[#6D28D9] hover:to-[#4C1D95] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg'
                }`}
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
              Don't have an account?
              <Link to={"/registration"} className="text-[#5D5CDE] hover:text-[#4a49b8] font-medium ml-1">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
