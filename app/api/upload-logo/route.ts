import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json(
      { error: 'No file provided' },
      { status: 400 }
    )
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    return NextResponse.json(
      { error: 'File must be an image' },
      { status: 400 }
    )
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json(
      { error: 'File size must be less than 5MB' },
      { status: 400 }
    )
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const results = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({
        folder: 'thinksale-logos',
        resource_type: 'auto',
        transformation: [
          { width: 200, height: 200, crop: 'fill', gravity: 'center' }
        ]
      }, (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      }).end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: (results as any).secure_url,
      filename: file.name
    })

  } catch (error) {
    console.error('Error uploading logo to Cloudinary:', error)
    return NextResponse.json(
      { error: 'Failed to upload logo' },
      { status: 500 }
    )
  }
} 