import UserCard from "../components/UserCard";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/store";
import LoadingSpinner from "../components/loadingSpinner";
import { motion } from "framer-motion";
import toast from "react-hot-toast";


import {
  FaPlus,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

// const ErrorDisplay = ({ message }) => (
//   <div className="text-red-500 text-center p-4">Error: {message}</div>
// );

// Pagination Component
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="bg-white  w-fit mx-auto rounded-lg shadow-md p-4 my-10">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {/* Items Info */}
        <div className="text-sm text-gray-700 hidden">
          Showing {startItem} to {endItem} of {totalItems} users
        </div>

        {/* Page Navigation */}
        <div className="flex items-center gap-2">
          {/* Previous Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <FaChevronLeft size={12} />
            Previous
          </motion.button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1 ">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => {
                // Show page numbers with ellipsis logic
                const showPage =
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);

                if (!showPage) {
                  // Show ellipsis
                  if (
                    pageNum === currentPage - 2 ||
                    pageNum === currentPage + 2
                  ) {
                    return (
                      <span key={pageNum} className="px-2 py-1 text-gray-500">
                        ...
                      </span>
                    );
                  }
                  return null;
                }

                return (
                  <motion.button
                    key={pageNum}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onPageChange(pageNum)}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                      currentPage === pageNum
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {pageNum}
                  </motion.button>
                );
              }
            )}
          </div>

          {/* Next Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Next
            <FaChevronRight size={12} />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default function HeroDashboard() {
  const { users, getAllUser, isLoading, error, logout, addNewUser } =
    useAuthStore();
  const [isAddUser, setIsAddUser] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [formData, setFormData] = useState({
    names: "",
    email: "",
    city: "",
    gender: "",
    age: "",
    course: "",
    nationality: "",
  });

  const handleAddUser = () => {
    setIsAddUser(true);
  };

  const handleCloseModal = () => {
    setIsAddUser(false);
    setFormData({
      names: "",
      email: "",
      city: "",
      gender: "",
      age: "",
      course: "",
      nationality: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addNewUser(
        formData.names,
        formData.email,
        parseInt(formData.age),
        formData.gender,
        formData.city,
        formData.nationality,
        formData.course
      );
      setIsAddUser(false);
      setFormData({
        names: "",
        email: "",
        city: "",
        gender: "",
        age: "",
        course: "",
        nationality: "",
      });
      await getAllUser();
          toast.success("User added successfully!"); 

    } catch (error) {
      console.error("Error adding user:", error);
     toast.error(error.response?.data?.message || error.message || "Failed to add user");
    }
  };

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await getAllUser();
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUsers();
  }, [getAllUser]);

  const userData = users?.data || [];

  // Filter users based on search term
  const filteredUsers = userData.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.names?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.city?.toLowerCase().includes(searchLower) ||
      user.course?.toLowerCase().includes(searchLower)
    );
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 10, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

   if (isLoading) return <LoadingSpinner />;
  // if (error) return <ErrorDisplay message={error} />;

  return (
    <div className="md:px-[50px] px-3">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleLogout}
        disabled={isLoading}
        className="max-w-[150px] w-full py-3 px-3 my-5 flex justify-self-end justify-center bg-gradient-to-r from-green-500 to-emerald-600 text-white
              font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
      >
        {isLoading ? "Logging out..." : "Logout"}
      </motion.button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="">
          <h1 className="text-4xl font-bold text-white">Registered Users</h1>
          <p className="text-lg font-medium text-white">
            Manage all registered users ({filteredUsers.length} of{" "}
            {userData.length} users)
          </p>
        </div>
        <button
          onClick={handleAddUser}
          className="max-w-[160px] w-full py-3 px-3 my-5 flex justify-self-end justify-center items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white
              font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          <FaPlus size={15} /> Add New User
        </button>
      </div>

      {/* Search Bar and Items Per Page */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, city, or course..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
            />
          </div>
          {searchTerm && (
            <p className="mt-2 text-sm text-gray-300">
              Showing {filteredUsers.length} result
              {filteredUsers.length !== 1 ? "s" : ""} for "{searchTerm}"
            </p>
          )}
        </div>

        {/* Items per page selector */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-white"></label>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
          <span className="text-sm text-white">per page</span>
        </div>
      </div>

      <div className="w-full">
        {currentUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-md">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-700">
                    Name
                  </th>
                  <th className="text-left p-4 font-medium text-gray-700">
                    Email
                  </th>
                  <th className="text-left p-4 font-medium text-gray-700">
                    Age
                  </th>
                  <th className="text-left p-4 font-medium text-gray-700">
                    Gender
                  </th>
                  <th className="text-left p-4 font-medium text-gray-700">
                    Location
                  </th>
                  <th className="text-left p-4 font-medium text-gray-700">
                    Nationality
                  </th>
                  <th className="text-left p-4 font-medium text-gray-700">
                    Course
                  </th>
                  <th className="text-left p-4 font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <UserCard key={user._id} user={user} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-white text-lg">
              {searchTerm ? (
                <>
                  <p className="mb-2">No users found matching "{searchTerm}"</p>
                  <p className="text-sm text-gray-300">
                    Try adjusting your search terms or{" "}
                    <button
                      onClick={() => setSearchTerm("")}
                      className="text-green-400 hover:text-green-300 underline"
                    >
                      clear search
                    </button>
                  </p>
                </>
              ) : (
                "No users found"
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pagination Component */}
      {filteredUsers.length > 0 && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={filteredUsers.length}
          itemsPerPage={itemsPerPage}
        />
      )}

      {/* Add User Modal */}
      {isAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add User</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="names"
                  placeholder="Field is required"
                  value={formData.names}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                  placeholder="Field is required"
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="mb-4 flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="mb-4 flex-1">
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    placeholder="Field is required"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="mb-4 flex-1">
                  <label
                    htmlFor="course"
                    className="block text-sm font-medium mb-1"
                  >
                    Course *
                  </label>
                  <select
                    id="course"
                    name="course"
                    value={formData.course}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select a course</option>
                    <option value="web-development">Web Development</option>
                    <option value="mobile-app-development">
                      Mobile App Development
                    </option>
                    <option value="data-science">
                      Data Science & Analytics
                    </option>
                    <option value="artificial-intelligence">
                      Artificial Intelligence
                    </option>
                    <option value="cybersecurity">Cybersecurity</option>
                    <option value="ui-ux">UI/UX</option>
                    <option value="graphic-design">Graphic Design</option>
                  </select>
                </div>
                <div className="mb-4 flex-1">
                  <label className="block text-sm font-medium mb-1">Age</label>
                  <input
                    type="number"
                    name="age"
                    placeholder="Field is required"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    min="16"
                    max="120"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Nationality
                </label>
                <input
                  type="text"
                  name="nationality"
                  placeholder="Field is required"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-[180px] py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white
              font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                  {isLoading ? "Adding..." : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
