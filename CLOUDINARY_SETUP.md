# Profile Image Upload Setup - Cloudinary Configuration

## Getting Started with Cloudinary

### 1. Create a Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Verify your email

### 2. Get Your Credentials
1. Login to your Cloudinary dashboard
2. Go to **Dashboard** → **Account Details**
3. Copy the following values:
   - **Cloud Name**
   - **API Key** 
   - **API Secret**

### 3. Update Environment Variables
Open `server/.env` and replace the placeholder values:

```env
# Replace with your actual Cloudinary credentials
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key  
CLOUDINARY_API_SECRET=your_actual_api_secret
```

### 4. Test the Setup
1. Start your server: `npm start` (in server directory)
2. Start your client: `npm run dev` (in client directory)
3. Try uploading a profile image when adding a student

## Features Implemented

✅ **Image Upload on Student Registration**
- File validation (image types only, 5MB limit)
- Auto-resize to 300x300 pixels
- Face-detection cropping

✅ **Image Management in User Profile**
- Update profile image with camera button
- Delete profile image with trash button
- Loading states and error handling

✅ **Image Display Throughout App**
- Student table shows profile images
- Fallback to initials when no image
- Consistent sizing and styling

✅ **Security & Performance**
- Images stored securely on Cloudinary
- Automatic format optimization (WebP, etc.)
- CDN delivery for fast loading

## File Structure Created

```
server/
├── config/cloudinary.js          # Cloudinary setup & multer config
├── controllers/StudentController.js # Updated with image handling
├── routes/studentRoutes.js        # Added image upload routes

client/
├── components/ProfileImage/       # Reusable image component
├── pages/AddStudent/             # Updated with image upload
├── pages/UserProfile/            # Updated with image management
├── components/StudentTable/       # Updated to show images
```

## API Endpoints

- `POST /api/student/add` - Create student with optional image
- `PUT /api/student/profile-image` - Update profile image  
- `DELETE /api/student/profile-image` - Delete profile image

## Troubleshooting

**"Upload failed" errors:**
- Check Cloudinary credentials in `.env`
- Ensure file is under 5MB
- Verify it's a valid image format

**Images not showing:**
- Check browser console for errors
- Verify Cloudinary URLs are accessible
- Check network tab for failed requests
