import mongoose from "mongoose";

const backlogSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    tasks: {
        type: [mongoose.Types.ObjectId],
        required: false
    },
    sprints: {
        type: [mongoose.Types.ObjectId],
        required: false
    },
    projectId: {
        type: mongoose.Types.ObjectId,
        required: true
    }
})

export default mongoose.model("Backlog", backlogSchema);