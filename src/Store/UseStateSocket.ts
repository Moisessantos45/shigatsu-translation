import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { TypeDataNotification } from "../Types/Types";

type State = {
  socket: Socket | null;
  setSocket: (socket: Socket | null) => void;
  connect: () => void;
  emitir: (evento: string, data: TypeDataNotification) => void;
};

const UseStateSocket = create<State>()((set, get) => ({
  socket: null,
  setSocket: (socket) => set({ socket }),
  connect: () => {
    const socket: Socket = io(import.meta.env.VITE_BACKEND_HOST_USER);
    set({ socket });
  },
  emitir: (evento: string, data: TypeDataNotification) => {
    const { socket } = get();
    if (socket) {
      socket.emit(evento, data);
    }
  },
}));

export default UseStateSocket;
