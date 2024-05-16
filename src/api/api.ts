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

export interface DataSource<T> {
  /**
   * Retrieves up to the next `pageSize` elements (if they exist). The results
   * are assumed to be ordered and if a `start` value is specified the next
   * elements starting _after_ `start` are returned if it exists (it will throw
   * if it does not). Otherwise the 1st page is returned.
   */
  getItems(pageSize: number, start?: T): T[];
}

export interface PagedDataSource<T> {
  /**
   * Retrieves up to the next `pageSize` elements (if they exist) from the data
   * source. The results are assumed to be ordered and if a `start` value is
   * specified the next elements starting _after_ `start` are returned.
   * Otherwise the 1st page is returned.
   */
  getNextPage(pageSize: number, start?: T): Page<T>;

  /**
   * Retrieves up to the next `pageSize` elements (if they exist) from the data
   * source that satisfy the given predicate.
   */
  getNextPageWithPredicate(predicate: (item: T) => boolean, pageSize: number, start?: T): Page<T>;
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
