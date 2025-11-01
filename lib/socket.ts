// Socket.IO client setup for real-time features
import { io, type Socket } from "socket.io-client"

class SocketService {
  private socket: Socket | null = null

  connect() {
    if (typeof window !== "undefined" && !this.socket) {
      this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001", {
        transports: ["websocket"],
      })

      this.socket.on("connect", () => {
        console.log("Connected to socket server")
      })

      this.socket.on("disconnect", () => {
        console.log("Disconnected from socket server")
      })
    }
    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  // Donation events
  onNewDonation(callback: (data: any) => void) {
    this.socket?.on("new_donation", callback)
  }

  onLeaderboardUpdate(callback: (data: any) => void) {
    this.socket?.on("leaderboard_update", callback)
  }

  onScratchCardEarned(callback: (data: any) => void) {
    this.socket?.on("scratch_card_earned", callback)
  }

  onBadgeEarned(callback: (data: any) => void) {
    this.socket?.on("badge_earned", callback)
  }

  // Request board events
  onNewRequest(callback: (data: any) => void) {
    this.socket?.on("new_request", callback)
  }

  onRequestFulfilled(callback: (data: any) => void) {
    this.socket?.on("request_fulfilled", callback)
  }

  // Impact updates
  onImpactUpdate(callback: (data: any) => void) {
    this.socket?.on("impact_update", callback)
  }

  // Emit events
  emitDonation(data: any) {
    this.socket?.emit("donation", data)
  }

  emitRedemption(data: any) {
    this.socket?.emit("redemption", data)
  }

  emitNewRequest(data: any) {
    this.socket?.emit("new_request", data)
  }

  // Clean up event listeners
  off(event: string, callback?: any) {
    this.socket?.off(event, callback)
  }
}

export const socketService = new SocketService()
