import React, { useState } from 'react';
import Input from '../../components/ui/Input';
import type { FormData } from "../../types";
import { Link, useNavigate } from 'react-router-dom';
import { base_url } from '../../utils/apiFetch';

type AccountType = 'student' | 'administrator' | null;

type Errors = {
  fullName?: string;
  username?: string;
  email?: string;
  password?: string;
  submit?: string;
};

type Status = {
  success: boolean | null;
};

const Registration: React.FC = () => {
  const [selectedAccountType, setSelectedAccountType] = useState<AccountType>('student');
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    username: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ success: null });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({});
    setStatus({ success: null });
    setSubmitting(true);

    if (!selectedAccountType) {
      alert('Please select an account type');
      setSubmitting(false);
      return;
    }

    const submitData = {
      accountType: selectedAccountType,
      ...formData
    };

    try {
      const response = await fetch(`${base_url}/api/users/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData)
      });

      const rsp = await response.json();

      if (response.ok) {
        setStatus({ success: true });
        console.log("Registration successful!", rsp);
      
        // Navigate to login page on success
        navigate('/');
      } else if (response.status === 400) {
        setStatus({ success: false });
        setErrors({ submit: rsp.detail || "Registration failed" });
      } else {
        setStatus({ success: false });
        setErrors({ submit: "Something went wrong. Please try again." });
      }
    } catch (err: any) {
      setErrors({ submit: err.message || "Network error" });
      setStatus({ success: false });
    } finally {
      setSubmitting(false);
    }
  };

  const selectAccountType = (type: AccountType) => {
    setSelectedAccountType(type);
  };

  return (
    <div className="fixed inset-0 overflow-hidden flex flex-col lg:flex-row">
      {/* Left Side - Branding */}
      <div className="w-full lg:w-1/2 relative min-h-[40vh] lg:min-h-full hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-[#130122] via-[#2D1B69] to-[#3d1a6b]"></div>
        
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
            <div className="flex justify-between items-center mb-4 block lg:hidden">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-900 to-orange-400 bg-clip-text text-transparent">
                DIGICHAMP
              </h1>
            </div>
            <div className="text-start mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h2>
              <p className="text-gray-600 dark:text-gray-400">Choose your account type and start your journey with us</p>
            </div>

            {/* Account Type Selection */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div 
                className={`cursor-pointer rounded-lg p-4 text-center bg-gray-50 dark:bg-gray-800 transition-all duration-300 border-2 ${
                  selectedAccountType === 'student' 
                    ? 'border-primary bg-purple-50 dark:bg-purple-900/20 shadow-lg' 
                    : 'border-transparent hover:border-primary/50'
                }`}
                onClick={() => selectAccountType('student')}
              >
                <div className="text-2xl mb-2">🎓</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Student</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Take quizzes and track your progress</p>
              </div>
              <div 
                className={`cursor-pointer rounded-lg p-4 text-center bg-gray-50 dark:bg-gray-800 transition-all duration-300 border-2 ${
                  selectedAccountType === 'administrator' 
                    ? 'border-primary bg-purple-50 dark:bg-purple-900/20 shadow-lg' 
                    : 'border-transparent hover:border-primary/50'
                }`}
                onClick={() => selectAccountType('administrator')}
              >
                <div className="text-2xl mb-2">📊</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Administrator</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Control the dashboard, and view analytics.</p>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button 
                className="flex items-center justify-center px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                type="button"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button 
                className="flex items-center justify-center px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                type="button"
              >
                <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">OR</span>
              </div>
            </div>

            {status.success === true && (
                <div className="mb-4 p-3 rounded bg-green-100 text-green-800 text-sm font-medium">
                  Registration successful! Redirecting...
                </div>
              )}

              {status.success === false && errors.submit && (
                <div className="mb-4 p-3 rounded bg-red-100 text-red-800 text-sm font-medium">
                  {errors.submit}
                </div>
              )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  name="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  icon={
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  }
                />
                <Input
                  label="Username"
                  name="username"
                  type="text"
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={handleInputChange}
                  icon={
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  }
                />
              </div>

              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleInputChange}
                icon={
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                }
              />

              <Input
                label="Password"
                name="password"
                type="password"
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
                type="submit" 
                disabled={submitting}
                className={`w-full py-3 px-4 rounded-lg text-white font-semibold text-base focus:outline-none focus:ring-4 ${
                  submitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] hover:from-[#6D28D9] hover:to-[#4C1D95] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg'
                }`}
              >
                {submitting ? 'Signing up...' : 'Sign Up'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
              Already have an account? 
              <Link to={"/"} className="text-[#5D5CDE] hover:text-[#4a49b8] font-medium ml-1">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;