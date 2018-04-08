const socketListener = (socket) => {
    socket.on('added', res => {
        console.log(res);
    });
};

export default socketListener;