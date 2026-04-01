import PusherJS from "pusher-js";

const client = new PusherJS("HKFHWKF", {
  cluster: "",
  wsHost: "soketi-fy9d.onrender.com",
  wsPort: 443,
  forceTLS: true,
  encrypted: true,
  disableStats: true,
  enabledTransports: ["ws", "wss"],
});

export default client;
