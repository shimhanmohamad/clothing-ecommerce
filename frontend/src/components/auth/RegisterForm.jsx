import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    const result = await register(
      formData.name,
      formData.email,
      formData.password
    );

    if (result.success) {
      toast.success('Registration successful!');
      navigate('/');
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Full Name */}
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-gray-700 font-medium">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Enter your full name"
          className="border rounded-lg p-3 focus:ring-2 focus:ring-primary-500 transition outline-none"
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-gray-700 font-medium">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="example@gmail.com"
          className="border rounded-lg p-3 focus:ring-2 focus:ring-primary-500 transition outline-none"
        />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-gray-700 font-medium">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          placeholder="At least 6 characters"
          className="border rounded-lg p-3 focus:ring-2 focus:ring-primary-500 transition outline-none"
        />
      </div>

      {/* Confirm Password */}
      <div className="flex flex-col gap-1">
        <label htmlFor="confirmPassword" className="text-gray-700 font-medium">
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          placeholder="Re-enter password"
          className="border rounded-lg p-3 focus:ring-2 focus:ring-primary-500 transition outline-none"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>

      {/* Switch to Login */}
      <p className="text-center text-gray-600">
        Already have an account?{' '}
        <Link
          to="/login"
          className="text-primary-600 font-semibold hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
