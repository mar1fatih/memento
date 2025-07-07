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
    const { firstName, lastName, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, password: hashed },
      { new: true }
    );
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (error) {
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