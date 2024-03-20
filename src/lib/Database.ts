import { MONGODB_URI } from '$env/static/private';
import mongoose from 'mongoose';

export async function connectToDatabase() {
	await mongoose.connect(MONGODB_URI);
}
