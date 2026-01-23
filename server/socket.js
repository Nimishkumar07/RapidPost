import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: ["https://rapidpost.live",
                "https://www.rapidpost.live",
                "http://localhost:5173"],
            methods: ["GET", "POST"],
            credentials: true
        }
    });
    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};
