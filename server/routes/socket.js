const socketApi = (io) => {
    io.on('connection', socket => {
        console.log(`connected: ${socket.id}`);

    });
};

module.exports = socketApi;