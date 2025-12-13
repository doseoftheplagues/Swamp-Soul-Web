import { Router } from 'express'
import multer from 'multer'
import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import crypto from 'node:crypto'

const S3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
})

const storage = multer.memoryStorage()
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB upload limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/jpg',
    ]

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true) // Accept file
    } else {
      cb(new Error('Unsupported file type. Allowed types: jpg, png, webp')) // Reject file
    }
  },
})

const router = Router()

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const file = req.file

    if (!file) {
      return res.status(400).send('No file uploaded.')
    }

    const fileName = crypto.randomBytes(16).toString('hex')

    const parallelUploads3 = new Upload({
      client: S3,
      params: {
        Bucket: process.env.R2_BUCKET_NAME,
        Key: `${fileName}_${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      },
    })

    parallelUploads3.on('httpUploadProgress', (progress) => {
      console.log(progress)
    })

    await parallelUploads3.done()

    const publicUrl = process.env.R2_PUBLIC_URL
    const fileUrl = `${publicUrl}/${fileName}_${file.originalname}`

    res.status(200).json({
      message: 'File uploaded successfully!',
      url: fileUrl,
    })
  } catch (err) {
    console.error('Error uploading file:', err)
    res.status(500).send('Error uploading file.')
  }
})

router.get('/', async (req, res) => {
  res.send('This is the upload route. Use POST to upload files.')
})

export default router
