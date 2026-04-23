import React, { useState } from "react";
import { useAuthStore } from "../store/store";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";

export default function UserCard({ user }) {
  const { names, email, city, gender, age, course, nationality, _id } = user;
  const { deleteUser, editUser } = useAuthStore();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    names,
    email,
    city,
    gender,
    age,
    course,
    nationality,
  });

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    deleteUser(_id);
    setIsDeleteModalOpen(false);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
  };
  // const onDelete = () => {
  //   deleteUser(_id);
  // };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
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
      await editUser(_id, formData);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <>
      <tr className="border-b hover:bg-gray-50">
        <td className="p-4">{names}</td>
        <td className="p-4">{email}</td>
        <td className="p-4">{age}</td>
        <td className="p-4">{gender}</td>
        <td className="p-4">{city}</td>
        <td className="p-4">{nationality}</td>
        <td className="p-4">{course}</td>
        <td className="p-4">
          <div className="flex space-x-2">
            <button
              onClick={handleEditClick}
              className="px-3 py-1 bg-green-400 text-white rounded hover:bg-orange-600 transition text-sm"
            >
              <FaEdit size={20} />
            </button>
            <button
              onClick={handleDeleteClick}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
            >
              <FaRegTrashAlt size={20} />
            </button>
          </div>
        </td>
      </tr>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-6">This action cannot be undone. This will permanently delete the user account and remove their data fro the system</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <tr>
          <td colSpan="8">
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Edit User</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      name="names"
                      value={formData.names}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
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
                      <label className="block text-sm font-medium mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
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
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                      <label className="block text-sm font-medium mb-1">
                        Age
                      </label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        min="1"
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
                      className="w-[180px] py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
              font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                      // className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
