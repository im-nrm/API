import { Request, Response } from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from 'uuid';
import FileUtils from "./utils/fileUtils";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let _path = path.resolve(__dirname, "../../../uploads/tmp");
    FileUtils.ensureDirExists(_path);
    cb(null, _path);
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
  },
});


const upload = multer({ storage });

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const imageUrl = `uploads/${req.file.filename}`;
    
    // Guardar la URL en MongoDB
    const newImage = new ImageModel({ url: imageUrl });
    await newImage.save();

    res.json({ message: "Image uploaded successfully", url: imageUrl });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const uploadMiddleware = upload.single("image");


import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  
},{timestamps: true});

export const ImageModel = mongoose.model("Image", ImageSchema);


