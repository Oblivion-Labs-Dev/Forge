export class Codex {
  private knowledge: string[] = [];
  add(info: string) {
    this.knowledge.push(info);
  }
}
