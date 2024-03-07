import mongoose from "mongoose";

const sprintSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    goal: {
        type: String,
        required: false
    },
    tasks: {
        type: [mongoose.Types.ObjectId],
        required: false,
        default: []
    }
})

export default mongoose.model("Sprint", sprintSchema);