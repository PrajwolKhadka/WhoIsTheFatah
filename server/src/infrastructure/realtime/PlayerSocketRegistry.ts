export class PlayerSocketRegistry {
  private map = new Map<string, string>(); // playerId -> socketId

  set(playerId: string, socketId: string): void {
    this.map.set(playerId, socketId);
  }

  get(playerId: string): string | undefined {
    return this.map.get(playerId);
  }

  delete(playerId: string): void {
    this.map.delete(playerId);
  }
}
