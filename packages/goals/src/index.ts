export interface Objective {
  id: string;
  title: string;
}

export interface Blueprint {
  id: string;
  objectives: Objective[];
}
