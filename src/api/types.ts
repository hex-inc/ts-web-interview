export interface Entity {
  id: number;
}

export interface ProjectData extends Entity {
  title: string;
  creatorId: number;
}

export interface UserData extends Entity {
  name: string;
}