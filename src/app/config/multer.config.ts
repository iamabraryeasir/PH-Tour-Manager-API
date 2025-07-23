import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinaryUpload } from './cloudinary.config';

const storage = new CloudinaryStorage({
    cloudinary: cloudinaryUpload,
    params: {
        public_id: (req, file) => {
            const fileName = file.originalname;

            const baseName = fileName
                .substring(0, fileName.lastIndexOf('.'))
                .toLowerCase()
                .replace(/\s+/g, '-')
                // eslint-disable-next-line no-useless-escape
                .replace(/[^a-z0-9\-]/g, '');

            const uniqueFileName = `${Math.random()
                .toString(36)
                .substring(2)}-${Date.now()}-${baseName}`;

            return uniqueFileName;
        },
    },
});

export const multerUpload = multer({ storage });
