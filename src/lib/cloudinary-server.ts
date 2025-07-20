import { v2 as cloudinary } from 'cloudinary'

export async function uploadToCloudinary(buffer: Buffer, filename: string): Promise<{ url: string; publicId: string }> {
  // Configure Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        folder: 'datasets',
        public_id: `${Date.now()}_${filename.replace(/\.[^/.]+$/, '')}`,
        use_filename: true,
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else if (result) {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          })
        } else {
          reject(new Error('Upload failed'))
        }
      }
    )

    uploadStream.end(buffer)
  })
} 