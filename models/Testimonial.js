import mongoose from "mongoose";

const testimonialSchema =
  new mongoose.Schema({

    name: String,

    role: String,

    message: String,

    image: String,

  });

const Testimonial = mongoose.model(
  "Testimonial",
  testimonialSchema
);

export default Testimonial;