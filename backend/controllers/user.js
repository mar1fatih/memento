import User from "../models/User.js";
import bcrypt from 'bcrypt';

export const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

export const updateUserInfo = async (req, res) => {
  try {
    let user = null;
    const { firstName, lastName, password } = req.body;
    if (password && password.lenght <= 7) {
      return (res.status(400).json({ msg: "invalid password"}));
    }
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      user = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, password: hashed },
      { new: true }
      );
    } else {
      user = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName },
      { new: true }
      );
    }
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json({ msg: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};