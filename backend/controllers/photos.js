import Photo from '../models/Photo.js';
import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';

export const uploadPhoto = async (req, res) => {
  try {
    const file = req.file;
    const result = await cloudinary.uploader.upload_stream(
      { folder: 'memento' },
      async (error, result) => {
        if (error) return res.status(500).json({ error });
        const photo = new Photo({
          userId: req.user.id,
          url: result.secure_url,
          public_id: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          size: result.bytes,
          optimizedUrl: result.secure_url.replace('/upload/', '/upload/c_scale,h_230/'),
        });
        await photo.save();
        res.status(201).json(photo);
      }
    );

    result.end(file.buffer);
  } catch (err) {
    res.status(500).json({ error: 'Upload failed' });
  }
};

export const getPhotos = async (req, res) => {
  try {
    const photos = await Photo.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(photos);
  } catch (err) {
    res.status(500).json({ error: 'Fetch failed' });
  }
};

export const deletePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const photo = await Photo.findById(id);
    if (!photo) return res.status(404).json({ error: 'Photo not found' });
    await cloudinary.uploader.destroy(photo.public_id);
    await Photo.findByIdAndDelete(id);
    res.status(204).json();
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
};

export const uploadProfilePicture = async (req, res) => {
  try {
    const file = req.file;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const oldPublicId = user.picture_public_id;
    const result = await cloudinary.uploader.upload_stream(
      { folder: 'memento/profile_pictures' },
      async (error, result) => {
        if (error) return res.status(500).json({ error });
        const user = await User.findByIdAndUpdate(
          req.user.id,
          { profilePicture: result.secure_url, picture_public_id: result.public_id },
          { new: true }
        );
        if (oldPublicId && oldPublicId !== 'none') {
          await cloudinary.uploader.destroy(oldPublicId);
        }
        res.status(200).json(user);
      }
    );

    result.end(file.buffer);
  } catch (err) {
    res.status(500).json({ error: 'Upload failed' });
  }
};
