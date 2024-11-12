import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(process.env.MONGODB_URI.replace('fR4QsC77mmKgEtX7', '8BtPciLVN8Vc2IgE'));
    console.log('MongoDB Connected Successfully');

    if (mongoose.connection.readyState === mongoose.ConnectionStates.connected && mongoose.connection.db) {
      try {
        const dbName = mongoose.connection.db?.databaseName;
        console.log('Connected to database:', dbName);
        
        const collections = await mongoose.connection.db?.listCollections().toArray();
        if (collections) {
          console.log('Available collections:', collections.map(c => c.name));
        }
      } catch (err) {
        console.error('Error listing collections:', err);
      }
    } else {
      console.log('Database connection state:', 
        mongoose.connection.readyState === mongoose.ConnectionStates.connected ? 'Connected' :
        mongoose.connection.readyState === mongoose.ConnectionStates.connecting ? 'Connecting' :
        mongoose.connection.readyState === mongoose.ConnectionStates.disconnected ? 'Disconnected' :
        mongoose.connection.readyState === mongoose.ConnectionStates.disconnecting ? 'Disconnecting' :
        'Unknown'
      );
    }

  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    console.error('Details:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
};

export default connectDB;