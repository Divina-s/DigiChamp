import React, { useState, useEffect } from 'react';
import Input from '../../components/ui/Input';
import type { FormData } from "../../types";

type AccountType = 'student' | 'administrator' | null;

const ForgotPassword: React.FC = () => {
  const [selectedAccountType, setSelectedAccountType] = useState<AccountType>('student');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    username: '',
    email: '',
    password: ''
  });

  // Dark mode detection
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAccountType) {
      alert('Please select an account type');
      return;
    }
    
    const submitData = {
      accountType: selectedAccountType,
      ...formData
    };
    
    console.log('Form submitted with data:', submitData);
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
            <div className="text-start mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Forgot Password</h2>
              <p className="text-gray-600 dark:text-gray-400">Enter your registered email and we'll send you a reset link</p>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

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

              <button 
                type="submit" 
                className="w-full py-3 px-4 rounded-lg text-white font-semibold text-base focus:outline-none focus:ring-4 focus:ring-purple-300 bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] hover:from-[#6D28D9] hover:to-[#4C1D95] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                Reset Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;