const allowedMimeTypes = new Set(["image/jpeg", "image/png"]);

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.has(file.mimetype)) {
    cb(null, true);
    return;
  }

  cb(new Error("Only JPEG and PNG images are allowed"), false);
};

export const uploadCollegeId = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
});
