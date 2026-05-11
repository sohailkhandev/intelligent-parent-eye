import { io, Socket } from "socket.io-client";
import type { AlertAppsUsageSocketPayload } from "@types";

let socket: Socket | null = null;

let alertAppsUsageDialogCallback:
  | ((payload: AlertAppsUsageSocketPayload) => void)
  | null = null;

export function setAlertAppsUsageDialogCallback(
  cb: ((payload: AlertAppsUsageSocketPayload) => void) | null,
) {
  alertAppsUsageDialogCallback = cb;
}

type ConnectOptions = {
  apiBaseUrl: string;
  token: string;
};

function getCleanToken(token: string): string {
  return token.startsWith("Bearer ") ? token.slice(7) : token;
}

export function connectSocket({ apiBaseUrl, token }: ConnectOptions): Socket {
  if (socket?.connected) {
    return socket;
  }

  const cleanToken = getCleanToken(token);

  if (!cleanToken) {
    console.warn("[SOCKET] Cannot connect: no token provided");
    throw new Error("Socket connection requires a valid token");
  }

  socket = io(apiBaseUrl, {
    transports: ["polling", "websocket"],
    extraHeaders: {
      Authorization: `Bearer ${cleanToken}`,
    },
    auth: {
      token: cleanToken,
      authorization: `Bearer ${cleanToken}`,
    },
  });

  socket.on("connect", () => {
    console.log("[SOCKET] Connected", socket?.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("[SOCKET] Disconnected", reason);
  });

  socket.on("connect_error", (err) => {
    console.error("[SOCKET] Connect error", err.message);
  });

  socket.on("alertAppsUsage", (payload: AlertAppsUsageSocketPayload) => {
    console.log("[SOCKET EVENT] alertAppsUsage payload:", payload);
    alertAppsUsageDialogCallback?.(payload);
  });

  return socket;
}

export function getSocket(): Socket | null {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
