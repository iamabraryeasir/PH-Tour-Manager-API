import { v2 as cloudinary } from 'cloudinary';
import config from '.';
import { AppError } from '../errorHelpers/AppError';

cloudinary.config({
    cloud_name: config.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
    api_key: config.CLOUDINARY.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY.CLOUDINARY_API_SECRET,
});

export const deleteImageFromCloudinary = async (imageUrl: string) => {
    try {
        const publicIdSeparationRegex =
            /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;
        const match = imageUrl.match(publicIdSeparationRegex);

        if (match && match[1]) {
            const publicId = match[1];
            await cloudinary.uploader.destroy(publicId);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw new AppError(
            401,
            'Cloudinary image deletion failed',
            error.message
        );
    }
};

export const cloudinaryUpload = cloudinary;
