const socketApi = (io) => {
    io.on('connection', socket => {
        console.log(`connected: ${socket.id}`);

        socket.on('ADD_FRIEND', (data) => {
            console.log('Socket on ADD_FRIEND -- ' + JSON.stringify(data));
        });
    });
};

module.exports = socketApi;