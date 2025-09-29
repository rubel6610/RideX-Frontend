const { io } = require("socket.io-client");

const socket = io(process.env.NEXT_PUBLIC_SERVER_BASE_URL);
export default socket;
