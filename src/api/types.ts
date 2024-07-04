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

export interface GetPageArgs<T> {
  pageSize: number;
  start?: T;
  predicate?: (item: T) => boolean;
}

export interface ServerApi {
  getUsers(args: GetPageArgs<UserData>): Promise<Page<UserData>>;
  getProjects(args: GetPageArgs<ProjectData>): Promise<Page<ProjectData>>;
}

export interface Page<T> {
  results: T[];

  /**
   * If `hasMoreResults` is true, it is guaranteed that a call to `getNextPage`
   * starting from the last element of this page will yield at least one more
   * result.
   */
  hasMoreResults: boolean;
}
