import User from "../model/User.mjs";
import bcrypt from "bcrypt";

//GET QUERY
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").lean();
    if (!users?.length) {
      return res.status(400).json({ message: "No user found" });
    }
    res.json(users);
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

//PORT QUERY
export const createNewUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const duplicate = await User.findOne({ username }).lean().exec();

    if (duplicate) {
      return res.status(400).json({ message: "Duplicate Username" });
    }

    // const validateUsername = (regUsername) => {
    //   const regex = /^[a-zA-Z0-9_]/;
    //   if (!regex.test(regUsername)) {
    //     return {
    //       isValid: false,
    //       message:
    //         "Invalid username. Use 3-15 chars: letters, numbers, _ or -. No spaces.",
    //     };
    //   }

    //   if (regUsername.length < 4) {
    //     return {
    //       isValid: false,
    //       message: "Username is too short",
    //     };
    //   }
    //   if (regUsername.length > 15) {
    //     return {
    //       isValid: false,
    //       message: "Username is too long",
    //     };
    //   }
    //   return {
    //     isValid: true,
    //     message: "Username is valid",
    //   };
    // };

    // const validatePassword = (regPass) => {
    //   return regPass.length > 6;
    // };

    // const validateEmail = (regEmail) => {
    //   const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    //   return regex.test(regEmail);
    // };

    // const validateResult = validateUsername(username);

    // if (!username || !password || !email) {
    //   return res.status(400).json({ message: "All fields are required" });
    // }

    // if (!validateResult.isValid) {
    //   return res.status(400).json({ message: validateResult.message });
    // }

    // if (!validateEmail(email)) {
    //   return res.status(400).json({ message: "Email is invalid" });
    // }

    // if (!validatePassword(password)) {
    //   return res.status(400).json({ message: "Password is too short" });
    // }

    const hashedPwd = await bcrypt.hash(password, 10);

    const userObject = {
      username,
      password: hashedPwd,
      email,
      roles: "Member",
    };

    const user = await User.create(userObject);

    if (user) {
      return res.status(201).json({ message: `New user ${username}` });
    } else {
      return res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id, username, password, roles, active } = req.body;

    if (!id || !username || !roles || !typeof active !== "boolean") {
      return res.status(400).json({ message: "All fields are required" });
    }
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: "User ID required" });
    }

    const user = await User.findById(id).exec();

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const result = await User.deleteOne();
    console.log(user);

    const reply = `Username ${user} with ID ${user} deleted`;
    res.json(reply);
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};
