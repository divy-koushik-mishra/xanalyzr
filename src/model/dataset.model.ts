import mongoose, {Schema, Document} from 'mongoose';

export interface Dataset extends Document {
    userId: mongoose.Types.ObjectId
    name: string
    fileType: string
    fileSize: number
    columns: string[]
    rows: number
    cloudinaryUrl: string
    cloudinaryPublicId: string
    createdAt: Date
    updatedAt: Date
}

const datasetSchema = new Schema<Dataset>({
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true, index: true},
    name: {type: String, required: true},
    fileType: {type: String, required: true},
    fileSize: {type: Number, required: true},
    columns: {type: [String], required: true},
    rows: {type: Number, required: true},
    cloudinaryUrl: {type: String, required: true},
    cloudinaryPublicId: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
}, {
    timestamps: true
})

// Pre-save middleware to update updatedAt
datasetSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const Dataset = mongoose.models.Dataset || mongoose.model<Dataset>("Dataset", datasetSchema)

export default Dataset
