import express from 'express';
import {createServer} from 'node:http';
import {connectToSocket} from './controllers/socketManager.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import user_routes from './routes/user_routes.js';

const app=express();
const server=createServer(app);
const io=connectToSocket(server);

app.set('port',process.env.PORT || 3000);
app.use(cors());
app.use(express.json({limit:"40kb"}));
app.use(express.urlencoded({limit:"40kb",extended:true}));

app.use('/api/v1/users',user_routes);

const start=async ()=>{
    const connectionDb=await mongoose.connect(`${process.env.MONGO_URL}`);
    console.log("MONGODB CONNECTED");
    server.listen(app.get("port"),()=>{
        console.log("LISTENING ON PORT 3000");
    });
};
start();