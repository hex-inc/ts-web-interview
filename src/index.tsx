import * as React from "react";
import { render } from "react-dom";

import App from "./App";
import { PROJECTS, USERS } from "./api/data";
import { ProjectData, SERVER, UserData } from "./api";
import { Page } from "./api/pagination";

const rootElement = document.getElementById("root");
render(<App />, rootElement);

(window as any).test = () => {
  const testUser = async (user?: UserData) => {
    const pageSize = 5;
    const filterCallback = user ? (project: ProjectData) => project.creatorId === user.id : undefined;
    const userString = user != null ? `User ${user.name} (ID: ${user.id})` : `All users`;
    let totalCountFromApi = 0;
    let hasMoreResults = true;
    let lastProject: ProjectData | undefined = undefined;

    while (hasMoreResults) {
      const page: Page<ProjectData> = await SERVER.getProjects({ pageSize, startAfter: lastProject, filterCallback });
      if (page.hasMoreResults && page.results.length < pageSize) {
        console.log(
          `❌ ${userString} // Improperly sized page - hasMoreResults: true but results.length < pageSize`
        );
        console.groupEnd();
        return;
      }
      totalCountFromApi += page.results.length;
      hasMoreResults = page.hasMoreResults;
      lastProject = page.results[page.results.length - 1];
    }

    const totalCountFromRepo = filterCallback ? PROJECTS.filter(filterCallback).length : PROJECTS.length;

    if (totalCountFromApi !== totalCountFromRepo) {
      console.log(`❌ ${userString} // Mismatch: API count = ${totalCountFromApi}, Repo count = ${totalCountFromRepo}`);
    } else {
      console.log(`✅ ${userString} // Counts match: ${totalCountFromApi}`);
    }
  }
  Promise.all([...USERS.map(testUser), testUser()]);
}