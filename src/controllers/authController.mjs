import User from "../model/User.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const foundUser = await User.findOne({ email }).exec();

  if (!foundUser || !foundUser.active) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const match = await bcrypt.compare(password, foundUser.password);

  if (!match) return res.status(401).json({ message: "Unauthorized" });

  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: foundUser.username,
        email: foundUser.email,
        roles: foundUser.roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ accessToken });
};

export const register = async (req, res) => {
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

export const refresh = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });

      const foundUser = await User.findOne({
        email: decoded.email,
      }).exec();

      if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: foundUser.username,
            email: foundUser.email,
            roles: foundUser.roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
      res.json({ accessToken });
    }
  );
};

export const logout = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(204);

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

  res.json({ message: "Cookie cleared" });
};
