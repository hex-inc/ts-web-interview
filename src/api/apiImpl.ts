import { USERS, PROJECTS } from "./data";
import { ServerApi, ProjectData, UserData, Page, GetPageArgs } from "./types";
import { Paginator } from "./pagination";

class DefaultServer implements ServerApi {
  private static FAILURE_PERCENT = 0.0;
  private static SERVER_DELAY = 200;

  private readonly users: Paginator<UserData>;
  private readonly projects: Paginator<ProjectData>;

  constructor() {
    this.users = new Paginator(USERS);
    this.projects = new Paginator(PROJECTS);
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
            page = this.users.getNextPageWithFilter(predicate, pageSize, start);
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
            page = this.projects.getNextPageWithFilter(predicate, pageSize, start);
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
