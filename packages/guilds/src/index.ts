import { Artisan } from '@forge/artisans';

export class Guild {
  private artisans: Artisan[] = [];
  register(artisan: Artisan) {
    this.artisans.push(artisan);
  }
}
