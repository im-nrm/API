import mongoose from "mongoose";

const bugReportModel = new mongoose.Schema(
    {
        title:{
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        createdBy:{
            type: mongoose.Types.ObjectId,
            ref: 'users'
        }
    },
    {
        timestamps: true
    }
)
//TODO: check: si es necesario añadir mas cosas
//TODO 2: añadir esto en el esquema c:
const BugReportModel = mongoose.model('bugReport', bugReportModel);
export default BugReportModel;