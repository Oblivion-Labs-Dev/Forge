export class ArchiveStore {
  private data = new Map<string, any>();
  async save(key: string, value: any) {
    this.data.set(key, value);
  }
}
