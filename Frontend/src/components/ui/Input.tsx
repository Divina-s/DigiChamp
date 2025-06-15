// components/InputField.tsx
import React from "react";
import type { InputFieldProps } from "../../types";
import { Link } from "react-router-dom";

const Input: React.FC<InputFieldProps> = ({
  label,
  name,
  anchor,
  type = "text",
  placeholder = "",
  icon,
  value,
  onChange,
}) => {
  return (
    <div>
       <div className="flex items-center justify-between mb-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
        <Link to={"/forgot-password"} className="text-sm text-purple-600 hover:text-purple-500">
            {anchor}
        </Link>
       </div>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="form-input block w-full pl-10 pr-3 py-3 text-base border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default Input;
