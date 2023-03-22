import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import multer from "multer";
import dotenv from "dotenv";
import cloudinary from "cloudinary";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import educationRoutes from "./routes/educationRoutes.js";
import workRoutes from "./routes/workRoutes.js";
import levelRoutes from "./routes/levelRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import socialRoutes from "./routes/socialRoutes.js";
import servicesRoutes from "./routes/serviceRoutes.js";
import serviceDescriptionRoutes from "./routes/serviceDescriptionRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import technologyRoutes from "./routes/technologyRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import cvRoutes from "./routes/cvRoutes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();

connectDB();
//Config Cors
const whiteList = [process.env.FRONTEND_URL];
const corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Error de Cors"));
    }
  },
};
app.use(cors(corsOptions));
//config Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//Config Multer
const storage = multer.diskStorage({
  destination: path.join(__dirname, "public/uploads"),
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + path.extname(file.originalname));
  },
});
app.use(multer({ storage }).single("Image"));

//Routing
app.use("/api/users", userRoutes);
app.use("/api/educations", educationRoutes);
app.use("/api/works", workRoutes);
app.use("/api/levels", levelRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/socials", socialRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/services-descriptions", serviceDescriptionRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/technologies", technologyRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/cvs", cvRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
