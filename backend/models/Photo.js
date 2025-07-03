import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  url: String,
  public_id: String,
  createdAt: { type: Date, default: Date.now },
  width: Number,
  height: Number,
  format: String,
  size: Number,
  optimizedUrl: String,
});

export default mongoose.model('Photo', photoSchema);
