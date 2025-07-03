import Photo from '../models/Photo.js';
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
