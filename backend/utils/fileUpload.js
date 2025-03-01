const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.env.FILE_UPLOAD_PATH);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image") ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(new ErrorResponse("Unsupported file type", 400), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: process.env.MAX_FILE_UPLOAD * 1024 * 1024 },
});

exports.uploadFiles = upload.array("attachments", 5);
