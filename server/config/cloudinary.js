const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('Cloudinary config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not set',
  api_secret: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not set',
});

// Test Cloudinary connection
cloudinary.api.ping()
  .then(result => console.log('Cloudinary connection successful:', result))
  .catch(error => console.error('Cloudinary connection failed:', error));

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'attendify/students', // Folder in Cloudinary
    allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 300, height: 300, crop: 'fill', gravity: 'face' }, // Crop to square, focus on face
      { quality: 'auto', fetch_format: 'auto' } // Auto optimize quality and format
    ],
    public_id: (req, file) => {
      // Create unique filename with timestamp
      const timestamp = Date.now();
      const originalName = file.originalname.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_');
      return `student_${req.user?.id || 'unknown'}_${timestamp}_${originalName}`;
    },
  },
});

// Create multer upload middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    console.log('File filter - file:', file);
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// Create a wrapper function to handle upload errors
const uploadSingle = (fieldName) => {
  return (req, res, next) => {
    const uploadHandler = upload.single(fieldName);
    
    uploadHandler(req, res, (err) => {
      if (err) {
        console.error('Upload error:', err);
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ 
              message: 'File too large. Maximum size is 5MB.',
              success: false 
            });
          }
        }
        return res.status(400).json({ 
          message: err.message || 'File upload failed',
          success: false 
        });
      }
      
      console.log('Upload successful - file:', req.file);
      next();
    });
  };
};

// Helper function to delete image from Cloudinary
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};

// Helper function to extract public ID from Cloudinary URL
const extractPublicId = (imageUrl) => {
  if (!imageUrl) return null;
  
  const parts = imageUrl.split('/');
  const filename = parts[parts.length - 1];
  const publicId = filename.split('.')[0];
  
  // Include folder path if present
  const folderIndex = parts.indexOf('attendify');
  if (folderIndex !== -1) {
    const pathParts = parts.slice(folderIndex, -1);
    return `${pathParts.join('/')}/${publicId}`;
  }
  
  return publicId;
};

module.exports = {
  cloudinary,
  upload,
  uploadSingle,
  deleteImage,
  extractPublicId,
};
