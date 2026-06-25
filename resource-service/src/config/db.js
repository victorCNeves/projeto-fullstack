import mongoose from 'mongoose';

export default async () => {
  await mongoose.connect(process.env.MONGO_URI, { maxPoolSize: 10 });
  console.log('[resource-service] Conectado ao Mongo');
};
