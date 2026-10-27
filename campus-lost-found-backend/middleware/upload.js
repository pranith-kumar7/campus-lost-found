const allowedMimeTypes = new Set(["image/jpeg", "image/png"]);

const fileFilter = (req, file, cb) => {
  const extension = file.originalname?.toLowerCase().split(".").pop();
  const matchingExtensions = {
    "image/jpeg": new Set(["jpg", "jpeg"]),
    "image/png": new Set(["png"]),
  };
  const allowedExtensions = matchingExtensions[file.mimetype];

  if (allowedExtensions && allowedExtensions.has(extension)) {
    cb(null, true);
    return;
  }

  cb(new Error("Only matching JPEG/JPG and PNG image files are allowed"), false);
};

export const uploadCollegeId = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
});
