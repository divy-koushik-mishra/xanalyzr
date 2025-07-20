import { Plans } from '@/types';
import mongoose, {Schema, Document} from 'mongoose';

export interface User extends Document {
    clerkId: string
    plan: Plans
    username: string
    email: string
    phone?: string
    src?: string
    datasets: mongoose.Types.ObjectId[]
    createdAt: Date
    updatedAt: Date
}

const userSchema = new Schema<User>({
    clerkId: {type: String, required: true, unique: true},
    plan: {type: String, required: true, enum: ["free", "pro", "enterprise"]},
    username: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: String, required: false},
    src: {type: String, required: false},
    datasets: [{type: Schema.Types.ObjectId, ref: 'Dataset'}],
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
}, {
    timestamps: true
})

// Pre-save middleware to update updatedAt
userSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const User = mongoose.models.User || mongoose.model<User>("User", userSchema)

export default User
