// global.d.ts
interface Cloudinary {
    openUploadWidget: (
        options: object,
        callback: (error: any, result: any) => void
    ) => void;
}

interface Window {
    cloudinary: Cloudinary;
}
