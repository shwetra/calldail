import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT;
export const MONGO_URI = process.env.MONGO_URI;
export const JWT_SECRET_EMAIL = process.env.JWT_SECRET_EMAIL;
export const JWT_SECRET_NUMBER = process.env.JWT_SECRET_NUMBER;
export const PASSWORD_RESET_SECRET = process.env.PASSWORD_RESET_SECRET;
export const ADMIN_SECRET = process.env.ADMIN_SECRET;
export const SALT_ROUNDS = process.env.SALT_ROUNDS;
export const UPLOAD_FOLDER = process.env.UPLOAD_FOLDER;
export const PROFILE_PHOTO_FOLDER = process.env.PROFILE_PHOTO_FOLDER;
export const CAR_PHOTO_FOLDER = process.env.CAR_PHOTO_FOLDER;
export const DOCUMENTS_FOLDER = process.env.DOCUMENTS_FOLDER;
export const SMTP_HOST = process.env.SMTP_HOST;
export const SMTP_PORT = process.env.SMTP_PORT;
export const EMAIL = process.env.EMAIL;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;