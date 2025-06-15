import React, { useState, useEffect } from 'react';
import Input from '../../components/ui/Input';
import PassImg from '../../assets/img/pass.png';
import { Link } from 'react-router-dom';

type AccountType = 'student' | 'administrator' | null;

const ResetPassword: React.FC = () => {
  const [selectedAccountType, setSelectedAccountType] = useState<AccountType>('student');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      alert('Please fill in both password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    setShowSuccess(true);
  };


  const selectAccountType = (type: AccountType) => {
    setSelectedAccountType(type);
  };

  return (
    <div className="fixed inset-0 overflow-hidden flex flex-col lg:flex-row">
      {/* Left Side - Branding */}
      <div className="w-full lg:w-1/2 relative min-h-[40vh] lg:min-h-full">
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

            {/* Registration Form */}
            {!showSuccess ? (
                <div>
                    <div className="text-start mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Reset Password</h2>
                      <p className="text-gray-600 dark:text-gray-400">Input your new password</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="New Password"
                            name="newPassword"
                            type="password"
                            placeholder="••••••••••"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            icon={
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                            </svg>
                            }
                        />

                        <Input
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            icon={
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                            </svg>
                            }
                        />

                        <button 
                            type="submit" 
                            className="w-full py-3 px-4 rounded-lg text-white font-semibold text-base focus:outline-none focus:ring-4 focus:ring-purple-300 bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] hover:from-[#6D28D9] hover:to-[#4C1D95] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                        >
                            Confirm Password
                        </button>
                    </form>
                </div>
             ) : (
                <div className="transition-all duration-300 text-start">
                    <div className="mb-8">
                        <img src={PassImg}/>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Password Reset Successful!</h2>
                    <p className="text-gray-600">Login to proceed with your quizz!</p>
                    <div className="mt-8">
                        <button
                        type="button"
                        onClick={() => setShowSuccess(false)}
                        className="w-full py-3 px-4 rounded-lg text-white font-semibold text-base focus:outline-none focus:ring-4 focus:ring-purple-300 bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] hover:from-[#6D28D9] hover:to-[#4C1D95] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                        >
                        Login
                        </button>
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;