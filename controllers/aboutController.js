import cloudinary from "cloudinary";
import About from "../models/About.js";
import fs from "fs-extra";

const getAboutLanding = async (req, res) => {
  const abouts = await About.findOne()
    .where("user")
    .equals(process.env.ID_ADMIN)
    .select("-__v -createdAt -edit_Img_About -edit_Img_Pres -updatedAt -user");
  res.json(abouts);
};

const getAbouts = async (req, res) => {
  const abouts = await About.findOne().where("user").equals(req.user);
  res.json(abouts);
};

const getAbout = async (req, res) => {
  const { id } = req.params;
  const about = await About.findById(id);
  if (!about) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }
  if (about.user.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid action");
    return res.status(401).json({ msg: error.message });
  }
  res.json(about);
};

const editAbout = async (req, res) => {
  const { id } = req.params;
  const about = await About.findById(id);
  if (!about) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }
  if (about.user.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid action");
    return res.status(401).json({ msg: error.message });
  }
  about.presentation = req.body.presentation || about.presentation;
  about.description = req.body.description || about.description;
  about.resumen = req.body.resumen || about.resumen;

  try {
    const aboutStore = await about.save();
    res.json(aboutStore);
  } catch (error) {
    console.log(error);
  }
};

const changeImagePresentation = async (req, res) => {
  const { id } = req.params;
  const about = await About.findById(id);
  if (!about) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  if (about.user.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid Action");
    return res.status(403).json({ msg: error.message });
  }

  if (about.edit_Img_Pres === false) {
    about.edit_Img_Pres = true;
    if (req.file !== undefined) {
      const newImageUpload = await cloudinary.v2.uploader.upload(
        req.file.path,
        {
          folder: "eichticiImages",
          use_filename: true,
        }
      );

      about.imagePresentationURL = newImageUpload.url;
      about.imagePresentation_publicId = newImageUpload.public_id;
      try {
        const aboutStore = await about.save();
        await fs.unlink(req.file.path);
        res.json(aboutStore);
      } catch (error) {
        console.log(error);
      }
    } else {
      about.imagePresentationURL = about.imagePresentationURL;
      about.imagePresentation_publicId = about.imagePresentation_publicId;
      try {
        const aboutStore = await about.save();
        res.json(aboutStore);
      } catch (error) {
        console.log(error);
      }
    }
  } else {
    if (req.file !== undefined) {
      const { result } = await cloudinary.v2.uploader.destroy(
        about.imagePresentation_publicId
      );
      const newImageUpload = await cloudinary.v2.uploader.upload(
        req.file.path,
        {
          folder: "eichticiImages",
          use_filename: true,
        }
      );

      about.imagePresentationURL = newImageUpload.url;
      about.imagePresentation_publicId = newImageUpload.public_id;
      try {
        const aboutStore = await about.save();
        await fs.unlink(req.file.path);
        res.json(aboutStore);
      } catch (error) {
        console.log(error);
      }
    } else {
      about.imagePresentationURL = about.imagePresentationURL;
      about.imagePresentation_publicId = about.imagePresentation_publicId;
      try {
        const aboutStore = await about.save();
        res.json(aboutStore);
      } catch (error) {
        console.log(error);
      }
    }
  }
};

const changeImageAbout = async (req, res) => {
  const { id } = req.params;
  const about = await About.findById(id);
  if (!about) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  if (about.user.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid Action");
    return res.status(403).json({ msg: error.message });
  }

  if (about.edit_Img_About === false) {
    about.edit_Img_About = true;
    if (req.file !== undefined) {
      const newImageUpload = await cloudinary.v2.uploader.upload(
        req.file.path,
        {
          folder: "eichticiImages",
          use_filename: true,
        }
      );

      about.imageAboutURL = newImageUpload.url;
      about.imageAbout_publicId = newImageUpload.public_id;
      try {
        const aboutStore = await about.save();
        await fs.unlink(req.file.path);
        res.json(aboutStore);
      } catch (error) {
        console.log(error);
      }
    } else {
      about.imageAboutURL = about.imageAboutURL;
      about.imageAbout_publicId = about.imageAbout_publicId;
      try {
        const aboutStore = await about.save();
        res.json(aboutStore);
      } catch (error) {
        console.log(error);
      }
    }
  } else {
    if (req.file !== undefined) {
      const { result } = await cloudinary.v2.uploader.destroy(
        about.imageAbout_publicId
      );
      const newImageUpload = await cloudinary.v2.uploader.upload(
        req.file.path,
        {
          folder: "eichticiImages",
          use_filename: true,
        }
      );

      about.imageAboutURL = newImageUpload.url;
      about.imageAbout_publicId = newImageUpload.public_id;
      try {
        const aboutStore = await about.save();
        await fs.unlink(req.file.path);
        res.json(aboutStore);
      } catch (error) {
        console.log(error);
      }
    } else {
      about.imageAboutURL = about.imageAboutURL;
      about.imageAbout_publicId = about.imageAbout_publicId;
      try {
        const aboutStore = await about.save();
        res.json(aboutStore);
      } catch (error) {
        console.log(error);
      }
    }
  }
};

const changeImageResumen = async (req, res) => {
  const { id } = req.params;
  const about = await About.findById(id);
  if (!about) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  if (about.user.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid Action");
    return res.status(403).json({ msg: error.message });
  }

  if (about.edit_Img_Resumen === false) {
    about.edit_Img_Resumen = true;
    if (req.file !== undefined) {
      const newImageUpload = await cloudinary.v2.uploader.upload(
        req.file.path,
        {
          folder: "eichticiImages",
          use_filename: true,
        }
      );

      about.imageResumenURL = newImageUpload.url;
      about.imgResumen_publicid = newImageUpload.public_id;
      try {
        const aboutStore = await about.save();
        await fs.unlink(req.file.path);
        res.json(aboutStore);
      } catch (error) {
        console.log(error);
      }
    } else {
      about.imageResumenURL = about.imageResumenURL;
      about.imgResumen_publicid = about.imgResumen_publicid;
      try {
        const aboutStore = await about.save();
        res.json(aboutStore);
      } catch (error) {
        console.log(error);
      }
    }
  } else {
    if (req.file !== undefined) {
      const { result } = await cloudinary.v2.uploader.destroy(
        about.imgResumen_publicid
      );
      const newImageUpload = await cloudinary.v2.uploader.upload(
        req.file.path,
        {
          folder: "eichticiImages",
          use_filename: true,
        }
      );

      about.imageResumenURL = newImageUpload.url;
      about.imgResumen_publicid = newImageUpload.public_id;
      try {
        const aboutStore = await about.save();
        await fs.unlink(req.file.path);
        res.json(aboutStore);
      } catch (error) {
        console.log(error);
      }
    } else {
      about.imageResumenURL = about.imageResumenURL;
      about.imgResumen_publicid = about.imgResumen_publicid;
      try {
        const aboutStore = await about.save();
        res.json(aboutStore);
      } catch (error) {
        console.log(error);
      }
    }
  }
};

const changeImageBackground = async (req, res) => {
  const { id } = req.params;
  const about = await About.findById(id);
  if (!about) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  if (about.user.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid Action");
    return res.status(403).json({ msg: error.message });
  }

  if (about.edit_Img_BG === false) {
    about.edit_Img_BG = true;
    if (req.file !== undefined) {
      const newImageUpload = await cloudinary.v2.uploader.upload(
        req.file.path,
        {
          folder: "eichticiImages",
          use_filename: true,
        }
      );

      about.imageBG_URL = newImageUpload.url;
      about.imgBG_publicid = newImageUpload.public_id;
      try {
        const aboutStore = await about.save();
        await fs.unlink(req.file.path);
        res.json(aboutStore);
      } catch (error) {
        console.log(error);
      }
    } else {
      about.imageBG_URL = about.imageBG_URL;
      about.imgBG_publicid = about.imgBG_publicid;
      try {
        const aboutStore = await about.save();
        res.json(aboutStore);
      } catch (error) {
        console.log(error);
      }
    }
  } else {
    if (req.file !== undefined) {
      const { result } = await cloudinary.v2.uploader.destroy(
        about.imgBG_publicid
      );
      const newImageUpload = await cloudinary.v2.uploader.upload(
        req.file.path,
        {
          folder: "eichticiImages",
          use_filename: true,
        }
      );

      about.imageBG_URL = newImageUpload.url;
      about.imgBG_publicid = newImageUpload.public_id;
      try {
        const aboutStore = await about.save();
        await fs.unlink(req.file.path);
        res.json(aboutStore);
      } catch (error) {
        console.log(error);
      }
    } else {
      about.imageBG_URL = about.imageBG_URL;
      about.imgBG_publicid = about.imgBG_publicid;
      try {
        const aboutStore = await about.save();
        res.json(aboutStore);
      } catch (error) {
        console.log(error);
      }
    }
  }
};

export {
  getAboutLanding,
  getAbouts,
  getAbout,
  editAbout,
  changeImagePresentation,
  changeImageAbout,
  changeImageResumen,
  changeImageBackground,
};
