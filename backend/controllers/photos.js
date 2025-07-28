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
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 0;
    const skip = (page - 1) * limit;
    const totalPhotos = await Photo.countDocuments({ userId: req.user.id });
    if (page !== 0 && limit !== 0) {
      const totalPages = Math.ceil(totalPhotos / limit);
      const photos = await Photo.find({ userId: req.user.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      res.status(200).json({
        photos,
        page,
        limit,
        totalPhotos,
        totalPages
      });
    } else {
      const photos = await Photo.find({ userId: req.user.id });
      res.status(200).json({
        photos,
        page: 0,
        limit: 0,
        totalPhotos,
        totalPages: 0
      });
    }
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
        console.log('Profile picture uploaded:', result.secure_url);
        res.status(200).json(user);
      }
    );

    result.end(file.buffer);
  } catch (err) {
    console.error('Error uploading profile picture:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
};
