import React, { useState } from 'react';
import Input from '../../components/ui/Input';
import type { FormData } from '../../types';
import { base_url } from '../../utils/apiFetch';

const ForgotPassword: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    username: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${base_url}/api/users/paasword-reset/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Something went wrong');
      } else {
        alert(data.message || 'Password reset link sent to your email');
      }
    } catch (error) {
      console.error('Request failed:', error);
      alert('Network error. Please try again later.');
    }
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
            <div className="text-start mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Forgot Password</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Enter your registered email and we'll send you a reset link
              </p>
            </div>

            {/* Reset Form */}
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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
