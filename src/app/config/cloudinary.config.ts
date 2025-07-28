/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import config from '.';
import stream from 'stream';
import { AppError } from '../errorHelpers/AppError';

cloudinary.config({
    cloud_name: config.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
    api_key: config.CLOUDINARY.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY.CLOUDINARY_API_SECRET,
});

export const uploadBufferToCloudinary = async (
    buffer: Buffer,
    fileName: string
): Promise<UploadApiResponse | undefined> => {
    try {
        return new Promise((resolve, reject) => {
            const public_id = `pdf/${fileName}-${Date.now()}`;

            const bufferStream = new stream.PassThrough();
            bufferStream.end(buffer);

            cloudinary.uploader
                .upload_stream(
                    {
                        resource_type: 'auto',
                        public_id: public_id,
                        folder: 'pdf',
                    },
                    (error, result) => {
                        if (error) {
                            return reject(error);
                        }
                        resolve(result);
                    }
                )
                .end(buffer);
        });
    } catch (error: any) {
        throw new AppError(401, `Error uploading file ${error.message}`);
    }
};

export const deleteImageFromCloudinary = async (imageUrl: string) => {
    try {
        const publicIdSeparationRegex =
            /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;
        const match = imageUrl.match(publicIdSeparationRegex);

        if (match && match[1]) {
            const publicId = match[1];
            await cloudinary.uploader.destroy(publicId);
        }
    } catch (error: any) {
        throw new AppError(
            401,
            'Cloudinary image deletion failed',
            error.message
        );
    }
};

export const cloudinaryUpload = cloudinary;
