import app from "./app";

const PORT = process.env.PORT || 5000;

// Init socket
import { createServer } from "http";
import { initSocket } from "@/lib/socket";
// @ts-ignore
const httpServer = createServer(app);
initSocket(httpServer);

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Local url: http://localhost:${PORT}`);
});
