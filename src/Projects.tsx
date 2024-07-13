import * as React from "react";
import { ProjectData, SERVER } from "./api";

export interface NameById {
  [key: number]: string;
}

interface ProjectsProps {
  selectedUser?: number;
  nameById: NameById;
}

export default function Projects({ selectedUser, nameById }: ProjectsProps) {
  const [projects, setProjects] = React.useState<ProjectData[] | null>(() => null);
  const [hasMoreResults, setHasMoreResults] = React.useState<boolean>(false);

  const fetchProjects = React.useCallback((startAfter?: ProjectData, overwrite = false) => {
    const filterCallback = selectedUser != null ? (({ creatorId }: ProjectData) => creatorId === selectedUser) : undefined;
    SERVER.getProjects({ pageSize: 5, startAfter, filterCallback }).then((page) => {
      if (overwrite) {
        setProjects(_ => ([...(page.results ?? [])]));
      } else {
        setProjects(projects => [...(projects ?? []), ...page.results]);
      }
      setHasMoreResults(page.hasMoreResults);
    }).catch(() => {
      alert("Something went wrong...");
    });
  }, [selectedUser]);

  const loadMore = React.useCallback(() => {
    const start = projects?.length ? projects[projects.length - 1] : undefined;
    fetchProjects(start);
  }, [projects, fetchProjects])

  React.useEffect(() => {
    fetchProjects(undefined, true);
  }, [selectedUser, fetchProjects]);

  return (
    <div className="projects">
      {projects?.length === 0 && (<div>No projects found.</div>)}
      {projects?.map(project => (
        <div className="project" key={`project-${project.id}`}>
          <div>(ID {project.id}) {project.title}</div><div>{nameById[project.creatorId]}</div>
        </div>
      ))}
      <button disabled={!hasMoreResults} onClick={loadMore}>{projects?.length ? `${projects.length} Project(s) Loaded - ` : ''}Load more</button>
    </div>
  );
}