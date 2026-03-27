import PusherJS from "pusher-js";

const client = new PusherJS("HKFHWKF", {
    cluster: "",
    wsHost: "127.0.0.1",
    wsPort: 6002,
    forceTLS: false,
    encrypted: true,
    disableStats: true,
    enabledTransports: ["ws", "wss"],
});

export default client;
