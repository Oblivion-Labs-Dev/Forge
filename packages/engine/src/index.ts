export class ForgeEngine {
  private active = false;
  async ignite() {
    this.active = true;
    console.log('[ForgeEngine] Ignited execution loop.');
  }
  async stop() {
    this.active = false;
    console.log('[ForgeEngine] Stopped execution loop.');
  }
  isActive() {
    return this.active;
  }
}
