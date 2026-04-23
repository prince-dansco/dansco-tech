import User from "../model/userDetail.js";

export const createUser = async (req, res) => {
  try {
    const { names, age, city, gender, course, nationality, email } = req.body;
    if (
      !names ||
      !age ||
      !city ||
      !gender ||
      !course ||
      !nationality ||
      !email
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }
    const newUser = await User.create({
      names,
      age,
      city,
      gender,
      course,
      nationality,
      email,
    });
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    console.log(error, "Failed at creating user");
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors,
      });
    }
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }
    res.status(500).json({ success: false, message: "Failed to create user" });
  }
};
export const getAllUser = async (req, res) => {
  try {
    const getUser = await User.find({}).sort({ createdAt: -1 });
    if (getUser.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No users found" });
    }
    res.status(200).json({
      success: true,
      message: "Getting all users successfully",
      count: getUser.length,
      data: getUser,
    });
  } catch (error) {
    console.log(error, "Error from getting all users");
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// export const getAllUser = async (req, res) => {
//   try {
//     // Extract query parameters
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 5;
//     const search = req.query.search || "";
//     const sortBy = req.query.sortBy || "createdAt ";
//     const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

//     // Calculate skip value for pagination
//     const skip = (page - 1) * limit;
//     let searchQuery = {};
//     if (search) {
//       searchQuery = {
//         $or: [
//           { names: { $regex: search, $options: "i" } },
//           { email: { $regex: search, $options: "i" } },
//           { city: { $regex: search, $options: "i" } },
//           { course: { $regex: search, $options: "i" } },
//           { nationality: { $regex: search, $options: "i" } },
//         ],
//       };
//     }

//     // Get total count for pagination info
//     const totalUsers = await User.countDocuments(searchQuery);
//     const users = await User.find(searchQuery)
//       .sort({ [sortBy]: sortOrder })
//       .skip(skip)
//       .limit(limit);
//     const totalPages = Math.ceil(totalUsers / limit);
//     const hasNextPage = page < totalPages;
//     const hasPrevPage = page > 1;

//     if (users.length === 0 && totalUsers === 0) {
//       return res.status(404).json({ 
//         success: false, 
//         message: search ? "No users found matching search criteria" : "No users found" 
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Getting all users successfully",
//       data: users,
//       pagination: {
//         currentPage: page,
//         totalPages,
//         totalUsers,
//         usersPerPage: limit,
//         hasNextPage,
//         hasPrevPage,
//         nextPage: hasNextPage ? page + 1 : null,
//         prevPage: hasPrevPage ? page - 1 : null,
//       },
//       search: search || null,
//     });
//   } catch (error) {
//     console.log(error, "Error from getting all users");
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };


export const getSingleUser = async (req, res) => {
  try {
    const singleUser = await User.findById(req.params.id);
    if (!singleUser) {
      res.status(404).json({ success: false, message: "user not found" });
    }
    res.status(200).json({
      success: true,
      data: singleUser,
      message: "single user successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const editUserDetail = async (req, res) => {
  try {
    const { names, age, city, gender, email, course, nationality } = req.body;
    const editUser = await User.findByIdAndUpdate(
      req.params.id,
      { names, age, city, gender, email, course, nationality },
      { new: true }
    );
    if (!editUser) {
      return res
        .status(404)
        .json({ success: false, message: "No users found" });
    }
    res.status(200).json({
      success: true,
      message: "editing  users successfully",
      data: editUser,
    });
  } catch (error) {
    console.log(error, "Error from editing user");
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const removeUser = await User.findByIdAndDelete(id);
    if (!removeUser) {
      return res
        .status(404)
        .json({ success: false, message: "No users found" });
    }
    res.status(200).json({
      success: true,
      message: "deleted  user successfully",
    });
  } catch (error) {
    console.log(error, "Error from deleting user");
    res.status(500).json({ success: false, message: "Server error" });
  }
};
