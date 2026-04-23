import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/store";
export default function Form() {
  const [formData, setFormData] = useState({
    names: "",
    email: "",
    age: "",
    gender: "",
    city: "",
    nationality: "",
    course: "",
  });
  const [errors, setErrors] = useState({});
  const { addNewUser, error, isLoading } = useAuthStore();

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.names.trim()) {
      newErrors.names = "Name is required";
    } else if (formData?.names?.trim().length < 2) {
      newErrors.names = "Name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email address";
    }

    // Age validation
    if (!formData.age) {
      newErrors.age = "Age is required";
    } else if (formData.age < 16) {
      newErrors.age = "Age must be at least 16";
    } else if (formData.age > 100) {
      newErrors.age = "Age must be less than 100";
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    // City validation
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    } else if (formData.city.trim().length < 2) {
      newErrors.city = "City must be at least 2 characters";
    }

    // Nationality validation
    if (!formData.nationality.trim()) {
      newErrors.nationality = "Nationality is required";
    } else if (formData.nationality.trim().length < 2) {
      newErrors.nationality = "Nationality must be at least 2 characters";
    }

    // Course validation
    if (!formData.course) {
      newErrors.course = "Course selection is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? (value === "" ? "" : parseInt(value)) : value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();

    if (!isValid) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      const { names, email, age, gender, city, nationality, course } = formData;
      await addNewUser(names, email, age, gender, city, nationality, course);

      // toast.success("Form submitted successfully!");
      toast.success(
        "Thanks for your message! A member of our support team will contact you as soon as possible."
      );

      setFormData({
        names: "",
        email: "",
        age: "",
        gender: "",
        city: "",
        nationality: "",
        course: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.message || "Failed to submit form. Please try again.");
    }
  };

  return (
    <div
      className="max-w-xl mx-auto p-6 py-3 px-4 bg-gradient-to-r from-green-800 to-emerald-900 text-white 
              font-bold rounded-lg shadow-lg my-10"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2 text-center">
          Enrollment Form for Client
        </h1>
      </div>
      <h3 className="text-2xl my-2">Personal Information</h3>
      <hr className="mb-2" />
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Name Field */}
        <div className="space-y-2">
          <label
            htmlFor="names"
            className="block text-sm font-medium text-white"
          >
            Full Name *
          </label>
          <input
            type="text"
            id="names"
            name="names"
            value={formData.names}
            onChange={handleChange}
            className={`w-full px-3 py-2 border text-white ${
              errors.names ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-transparent`}
            placeholder="Enter your full name"
          />
          {errors.names && (
            <p className="text-red-500 text-sm">{errors.names}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="flex flex-col md:flex-row  justify-between gap-4">
          <div className="space-y-2 flex-1">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white"
            >
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border text-white ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-transparent`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Age Field */}
          <div className="space-y-2 flex-1">
            <label
              htmlFor="age"
              className="block text-sm font-medium text-white"
            >
              Age *
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="16"
              max="100"
              className={`w-full px-3 py-2 border text-white ${
                errors.age ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-transparent`}
              placeholder="Enter your age"
            />
            {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
          </div>
        </div>

        {/* Gender Field (Radio Buttons) */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">
            Gender *
          </label>
          <div className="flex space-x-6">
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === "male"}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-sm text-white">Male</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === "female"}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-sm text-white">Female</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="other"
                checked={formData.gender === "other"}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-sm text-white">Other</span>
            </label>
          </div>
          {errors.gender && (
            <p className="text-red-500 text-sm">{errors.gender}</p>
          )}
        </div>

        <div className="flex flex-col md:flex-row  justify-between gap-4">
          {/* City Field */}
          <div className="space-y-2 flex-1">
            <label
              htmlFor="city"
              className="block text-sm font-medium text-white"
            >
              City *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={`w-full px-3 py-2 border text-white ${
                errors.city ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-transparent`}
              placeholder="Enter your city"
            />
            {errors.city && (
              <p className="text-red-500 text-sm">{errors.city}</p>
            )}
          </div>

          {/* Nationality Field */}
          <div className="space-y-2 flex-1">
            <label
              htmlFor="nationality"
              className="block text-sm font-medium text-white"
            >
              Nationality *
            </label>
            <input
              type="text"
              id="nationality"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              className={`w-full px-3 py-2 border text-white ${
                errors.nationality ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-transparent`}
              placeholder="Enter your nationality"
            />
            {errors.nationality && (
              <p className="text-red-500 text-sm">{errors.nationality}</p>
            )}
          </div>
        </div>

        {/* Course Field */}
        <div className="space-y-2">
          <label
            htmlFor="course"
            className="block text-sm font-medium text-white"
          >
            Course *
          </label>
          <select
            id="course"
            name="course"
            value={formData.course}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${
              errors.course ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-800 text-white`}
          >
            <option value="">Select a course</option>
            <option value="web-development">Web Development</option>
            <option value="mobile-app-development">
              Mobile App Development
            </option>
            <option value="data-science">Data Science & Analytics</option>
            <option value="artificial-intelligence">
              Artificial Intelligence
            </option>
            <option value="cybersecurity">Cybersecurity</option>
          </select>
          {errors.course && (
            <p className="text-red-500 text-sm">{errors.course}</p>
          )}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
              font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </span>
            ) : (
              "Submit Form"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
