import { USERS, PROJECTS } from "./data";
import { ServerApi, ProjectData, UserData, Page, DataSource, GetPageArgs } from "./api";
import { HexPagedDataSource } from "./pagination";

class DefaultServer implements ServerApi {
  private static FAILURE_PERCENT = 0.0;
  private static SERVER_DELAY = 200;

  private readonly users: HexPagedDataSource<UserData>;
  private readonly projects: HexPagedDataSource<ProjectData>;

  constructor() {
    this.users = new HexPagedDataSource(USERS);
    this.projects = new HexPagedDataSource(PROJECTS);
  }

  getUsers({ pageSize, start, predicate }: GetPageArgs<UserData>) {
    return new Promise<Page<UserData>>((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < DefaultServer.FAILURE_PERCENT) {
          return reject("Server error");
        }
        try {
          let page;
          if (predicate != null) {
            page = this.users.getNextPageWithPredicate(predicate, pageSize, start);
          } else {
            page = this.users.getNextPage(pageSize, start);
          }
          resolve(page);
        } catch (_) {
          reject("Server error");
        }
      }, DefaultServer.SERVER_DELAY);
    });
  }

  getProjects({ pageSize, start, predicate }: GetPageArgs<ProjectData>) {
    return new Promise<Page<ProjectData>>((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < DefaultServer.FAILURE_PERCENT) {
          return reject("Server error");
        }
        try {
          let page;
          if (predicate != null) {
            page = this.projects.getNextPageWithPredicate(predicate, pageSize, start);
          } else {
            page = this.projects.getNextPage(pageSize, start);
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
