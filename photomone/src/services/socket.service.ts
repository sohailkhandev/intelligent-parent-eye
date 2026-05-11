import { io, Socket } from "socket.io-client";
import type {
  ExposureBatchEndedPayload,
  MarketEventPayload,
  MissionCompletedSocketPayload,
  SlotShareReceivedPayload,
} from "@types";

let socket: Socket | null = null;

type MarketEventCallback = (
  event: "photoSold" | "photoUnsold" | "exposureBatchEnded",
  data: MarketEventPayload | ExposureBatchEndedPayload
) => void;
let marketEventCallback: MarketEventCallback | null = null;

export function setMarketEventCallback(cb: MarketEventCallback | null) {
  marketEventCallback = cb;
}

let missionCompletedListener: (() => void) | null = null;

/** Optional hook for refetching missions (or other UI) when the server emits `missionCompleted`. */
export function setMissionCompletedListener(cb: (() => void) | null) {
  missionCompletedListener = cb;
}

let missionCompletedDialogCallback:
  | ((payload: MissionCompletedSocketPayload) => void)
  | null = null;

/** Global mission-completed modal (e.g. AppContext) — set from `SocketToastHandler`. */
export function setMissionCompletedDialogCallback(
  cb: ((payload: MissionCompletedSocketPayload) => void) | null
) {
  missionCompletedDialogCallback = cb;
}

function normalizeMissionCompletedPayload(
  raw: unknown
): MissionCompletedSocketPayload | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.missionName !== "string" || typeof o.points !== "number")
    return null;
  return {
    missionName: o.missionName,
    description: typeof o.description === "string" ? o.description : "",
    url: typeof o.url === "string" ? o.url : "",
    status: typeof o.status === "string" ? o.status : "completed",
    points: o.points,
    missionId:
      typeof o.missionId === "string"
        ? o.missionId
        : typeof o._id === "string"
          ? o._id
          : undefined,
    _id: typeof o._id === "string" ? o._id : undefined,
  };
}

type ConnectOptions = {
  apiBaseUrl: string;
  token: string;
};

function getCleanToken(token: string): string {
  return token.startsWith("Bearer ") ? token.slice(7) : token;
}

export function connectSocket({ apiBaseUrl, token }: ConnectOptions): Socket {
  if (socket?.connected) return socket;

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

  socket.on("photoSold", (data: MarketEventPayload) => {
    console.log("[SOCKET] photoSold", data);
    marketEventCallback?.("photoSold", data);
  });
  socket.on("photoUnsold", (data: MarketEventPayload) => {
    console.log("[SOCKET] photoUnsold", data);
    marketEventCallback?.("photoUnsold", data);
  });
  socket.on("exposureBatchEnded", (data: ExposureBatchEndedPayload) => {
    console.log("[SOCKET] exposureBatchEnded", data);
    marketEventCallback?.("exposureBatchEnded", data);
  });

  socket.on("missionCompleted", (missionObj: unknown) => {
    console.log("[SOCKET] missionCompleted", missionObj);
    missionCompletedListener?.();
    const normalized = normalizeMissionCompletedPayload(missionObj);
    if (normalized) missionCompletedDialogCallback?.(normalized);
  });

  socket.on("exposureBatchEndedDelayed", (data: ExposureBatchEndedPayload) => {
    console.log("[SOCKET] exposureBatchEndedDelayed", data);
    // Reuse the same downstream flow/dialog as exposureBatchEnded.
    marketEventCallback?.("exposureBatchEnded", data);
  });

  socket.on("slotShareReceived", (data: SlotShareReceivedPayload) => {
    console.log("[SOCKET] slotShareReceived", data);
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
