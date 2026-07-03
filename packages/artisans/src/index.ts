export interface Artisan {
  name: string;
  craft: string;
}

export class PlannerArtisan implements Artisan {
  name = 'Planner';
  craft = 'Planning';
}

export class BuilderArtisan implements Artisan {
  name = 'Builder';
  craft = 'Building';
}

export class ReviewerArtisan implements Artisan {
  name = 'Reviewer';
  craft = 'Reviewing';
}
