import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    name: String,
    desc: String,
    projectId: mongoose.Types.ObjectId,
    isChecked: Boolean,
    createdBy: mongoose.Types.ObjectId,
    created: Date,
    checkedDate: { type: Date, required: false },
    executors: [mongoose.Types.ObjectId],
    status: String
});

const TaskModel = mongoose.model('Task', taskSchema);

export default TaskModel;