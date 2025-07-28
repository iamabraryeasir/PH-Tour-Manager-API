import PDFDocument from 'pdfkit';
import { AppError } from '../errorHelpers/AppError';

export interface IInvoiceData {
    userName: string;
    transactionId: string;
    bookingDate: Date;
    tourTitle: string;
    guestCount: number;
    totalAmount: number;
}

export const generatePdfInvoice = async (
    invoiceData: IInvoiceData
): Promise<Buffer<ArrayBufferLike>> => {
    try {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ size: 'A4', margin: 50 });
            const buffers: Uint8Array[] = [];

            doc.on('data', (chunk) => buffers.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.on('error', (err) => reject(err));

            // pdf concat
            doc.fontSize(20).text('Invoice', { align: 'center' });

            doc.moveDown();

            doc.fontSize(14).text(
                `Transaction ID: ${invoiceData.transactionId}`
            );
            doc.text(`Booking Date: ${invoiceData.bookingDate}`);
            doc.text(`Customer: ${invoiceData.userName}`);

            doc.moveDown();

            doc.text(`Tour: ${invoiceData.tourTitle}`);
            doc.text(`Guests: ${invoiceData.guestCount}`);
            doc.text(`Total Amount: ${invoiceData.totalAmount.toFixed(2)}`);

            doc.moveDown();

            doc.text('Thank you for booking with us!', { align: 'center' });

            doc.end();
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw new AppError(401, 'PDF Creation error ' + error.message);
    }
};
