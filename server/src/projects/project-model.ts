import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: false,
    },
    created: {
        type: Date,
        required: true,
        unique: false,
    },
    lastModified: {
        type: Date,
        required: true,
        unique: false,
    },
    owner: {
        type: mongoose.Types.ObjectId,
        required: true,
        unique: false,
    },
    participants: {
      type: [{
        participant: mongoose.Types.ObjectId,
        rights: {
            create: Boolean,
            edit: Boolean,
            delete: Boolean,
            check: Boolean,
            editParticipants: Boolean,
            addParticipants: Boolean,
            editProjectData: Boolean,
            manageSprints: Boolean
        }
      }],
      required: true,
      unique: false,
    }
  });
  
  const ProjectModel = mongoose.model('Project', projectSchema);
  
export default ProjectModel;