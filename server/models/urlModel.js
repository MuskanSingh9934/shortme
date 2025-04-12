import { Schema, model } from "mongoose";

const URLSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  redirectURL: {
    type: String,
    required: true,
  },
  visitors: {
    type: Number,
    default: 0,
  },
});

export const URL = model("url", URLSchema);
