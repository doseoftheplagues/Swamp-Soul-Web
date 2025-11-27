// import { v2 as cloudinary } from 'cloudinary'
// import { CloudinaryStorage } from 'multer-storage-cloudinary'
// import multer from 'multer'
// import dotenv from 'dotenv'

// dotenv.config()

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
//   secure: true,
// })

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: async (req, file) => {
//     let publicId

//     if (file && typeof file.originalname === 'string') {
//       // 1. Get the original filename (e.g., "my_photo.jpg")
//       const originalFileName = file.originalname

//       // 2. Remove the file extension (e.g. "my_photo")
//       const nameWithoutExtension = originalFileName
//         .split('.')
//         .slice(0, -1) // -1 starts from the end of the array
//         .join('.')

//       // 3. Sanitize the filename to be URL-friendly: replace non-alphanumeric characters (except hyphens) with hyphens, and converts to lowercase.
//       const sanitizedName = nameWithoutExtension
//         .replace(/[^a-zA-Z0-9-]/g, '-')
//         .toLowerCase()

//       // 4. Add a timestamp for uniqueness
//       const timestamp = Date.now()

//       // 5. construct the public_id
//       // publicId = `${sanitizedName}-${timestamp}`

//       // option to include user info later:
//       const username = req.user?.username || 'user1' // req.user.username needs to be present (check this later)
//       publicId = `user-${username}-${sanitizedName}-${timestamp}`
//     } else {
//       // if no originalname, prompt warning and create a unique default
//       console.warn(
//         'file.originalname was not available. Using a default public_id.',
//       )

//       publicId = `uploaded-file-${Date.now()}`
//     }

//     return {
//       folder: 'uploads',
//       allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
//       transformation: [{ width: 1000, crop: 'limit', fetch_format: 'auto' }],
//       resource_type: 'auto',
//       public_id: publicId,
//       overwrite: false, // Allows preventing overwrites if public_id already exists (for edge case where same file name is uploaded at exact same time??)
//     }
//   },
// })

// // File type validation here (look into client side validation as well)
// const upload = multer({
//   storage,
//   limits: { fileSize: 10 * 1024 * 1024 }, // limits file size to 10 MB
//   fileFilter: (req, file, cb) => {
//     const allowedMimeTypes = [
//       'image/jpeg',
//       'image/png',
//       'image/webp',
//       'video/mp4',
//     ]

//     if (allowedMimeTypes.includes(file.mimetype)) {
//       cb(null, true) // Accept file
//     } else {
//       cb(new Error('Unsupported file type. Allowed types: jpg, png, webp, mp4')) // Reject file
//     }
//   },
// })

// export default upload

// // BACKEND

// import express, { json } from 'express'
// import upload from '../middleware/multer.config'
// import { getUserUploads, uploadImageToDb } from '../db/image_uploads'

// const router = express.Router()

// const mockUserId = 1 // mock user ID (REPLACE LATER)

// router.post('/', upload.single('image'), async (req, res) => {
//   if (!req.file) {
//     return res
//       .status(400)
//       .json({ error: 'No file uploaded or invalid file type' })
//   }

//   try {
//     // Save to DB using mock user
//     await uploadImageToDb({
//       user_id: mockUserId,
//       image_URL: req.file.path, // Cloudinary URL
//       caption: req.body.caption || null,
//     })

//     res.json({
//       message: 'Upload successful',
//       cloudinaryUrl: req.file.path,
//       publicId: req.file.filename,
//     })
//   } catch (err) {
//     console.error('Upload failed:', err)
//     res.status(500).send('Upload failed: internal server error')
//   }
// })

// router.get('/', async (req, res) => {
//   const id = mockUserId // change later

//   try {
//     const userUploads = await getUserUploads(id)
//     return res.json(userUploads)
//   } catch (err) {
//     console.error(err)
//     res.status(500).send('Request failed: internal server error')
//   }
// })

// export default router

// // componente

// import { useState } from 'react'
// import { Button } from '../Button'
// import Dropzone from './Dropzone'
// import useUploadImage from '@/hooks/use-image-upload'
// import useGetUserUploads from '@/hooks/use-get-user-uploads'

// import { Swiper, SwiperSlide } from 'swiper/react'
// import 'swiper/css'
// import 'swiper/css/navigation'
// import 'swiper/css/pagination'
// import {
//   FreeMode,
//   Mousewheel,
//   Navigation,
//   Pagination,
//   Scrollbar,
// } from 'swiper/modules'
// import { ChevronLeft, ChevronRight } from 'lucide-react'

// interface Prop {
//   selectedImage: string
//   setSelectedImage: (image_url: string) => void
// }

// export default function ImageUpload({ selectedImage, setSelectedImage }: Prop) {
//   const [preview, setPreview] = useState<null | string>(null)
//   const [file, setFile] = useState<File | null>(null)
//   const mutation = useUploadImage()

//   const { data: images, isPending, error } = useGetUserUploads()

//   if (isPending) return <p>Loading...</p>
//   if (error) return <p>Error loading past uploads</p>

//   const handlePreview = (file: File) => {
//     if (!file) {
//       setPreview(null)
//       return
//     }

//     setFile(file)
//     const previewURL = URL.createObjectURL(file)
//     setPreview(previewURL)
//   }

//   const handleUpload = async (event: React.MouseEvent) => {
//     event.preventDefault()

//     if (!file) return alert('Please select an image to upload')

//     try {
//       await mutation.mutateAsync(file)
//       setPreview(null)
//       setFile(null)
//     } catch (err) {
//       console.error('Upload failed:', err)
//     }
//   }

//   console.log(images)

//   return (
//     <div className="flex max-w-7xl h-80 bg-white rounded-lg shadow-xl border">
//       {/* display uploaded images */}
//       <div className="w-[660px] relative">
//         <h3 className="font-title p-5 py-3 text-4xl text-left">
//           Uploaded Images
//         </h3>
//         <Swiper
//           modules={[FreeMode, Mousewheel, Navigation, Pagination, Scrollbar]}
//           spaceBetween={10}
//           slidesPerView={2}
//           navigation={{
//             nextEl: '.custom-next',
//             prevEl: '.custom-prev',
//           }}
//           grabCursor={true}
//           freeMode={true}
//           pagination={{ clickable: true }}
//           mousewheel={true}
//           className="relative w-[600px] h-64 rounded"
//         >
//           {[...images].reverse().map((image) => (
//             <SwiperSlide key={image.id}>
//               <button
//                 type="button"
//                 onClick={() => setSelectedImage(image.image_url)}
//               >
//                 <img
//                   src={image.image_url}
//                   alt={`User's upload ${image.id}`}
//                   className={`object-contain w-full h-full rounded border-8 ${selectedImage === image.image_url ? 'border-primary' : 'border-border'}`}
//                 />
//               </button>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//         <button className="custom-prev absolute top-1/2 -left-3 z-10 transform -translate-y-1/2">
//           <ChevronLeft className="text-black" size={50} />
//         </button>
// ... (34 lines left)
