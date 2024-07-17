import { USERS, PROJECTS } from "./data";
import { ProjectData, UserData } from "./types";
import { Page, Paginator } from "./pagination";

// Colocating these in `apiImpl.ts` as they're not important for consumers of
// `types.ts`.
interface GetPageArgs<T> {
  pageSize: number;
  startAfter?: T;
  filterCallback?: (item: T) => boolean;
}
interface ServerApi {
  getUsers(args: GetPageArgs<UserData>): Promise<Page<UserData>>;
  getProjects(args: GetPageArgs<ProjectData>): Promise<Page<ProjectData>>;
}

class DefaultServer implements ServerApi {
  private static FAILURE_PERCENT = 0.0;
  private static SERVER_DELAY = 100;

  private readonly users: Paginator<UserData>;
  private readonly projects: Paginator<ProjectData>;

  constructor() {
    this.users = new Paginator(USERS);
    this.projects = new Paginator(PROJECTS);
  }

  getUsers({ pageSize, startAfter, filterCallback }: GetPageArgs<UserData>) {
    return new Promise<Page<UserData>>((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < DefaultServer.FAILURE_PERCENT) {
          return reject("Server error");
        }
        try {
          let page;
          if (filterCallback != null) {
            page = this.users.getNextPageWithFilter(filterCallback, pageSize, startAfter);
          } else {
            page = this.users.getNextPage(pageSize, startAfter);
          }
          resolve(page);
        } catch (_) {
          reject("Server error");
        }
      }, DefaultServer.SERVER_DELAY);
    });
  }

  getProjects({ pageSize, startAfter, filterCallback }: GetPageArgs<ProjectData>) {
    return new Promise<Page<ProjectData>>((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < DefaultServer.FAILURE_PERCENT) {
          return reject("Server error");
        }
        try {
          let page;
          if (filterCallback != null) {
            page = this.projects.getNextPageWithFilter(filterCallback, pageSize, startAfter);
          } else {
            page = this.projects.getNextPage(pageSize, startAfter);
          }
          resolve(page);
        } catch (_) {
          reject("Server error");
        }
      }, DefaultServer.SERVER_DELAY);
    });
  }
}

export const SERVER = new DefaultServer();
