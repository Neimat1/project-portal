import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { fetchProjects } from "../api/mockApi";
import type { Project, ProjectStatus } from "../types";
import { withLoading } from "../hoc/withLoading";
import { useSettings } from "../context/useSettings";

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; projects: Project[] };

interface ProjectListContentProps {
  projects: Project[];
}

interface ProjectCardProps {
  project: Project;
}

function ProjectListContent({ projects }: ProjectListContentProps) {
  const { compactList } = useSettings();
  if (projects.length === 0) {
    return <p>No projects match your filters.</p>;
  }

  return (
    <div
      className={`project-list ${compactList ? "project-list--compact" : ""}`}
    >
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="project-card">
      <h2>{project.name}</h2>

      <p>Status: {project.status.replace("_", " ")}</p>

      <p>Owner: {project.ownerName}</p>

      <Link
        to={`/dashboard/projects/${project.id}`}
        state={{ fromProjects: true }}
      >
        View details
      </Link>
    </article>
  );
}

const LoadingProjectList = withLoading(ProjectListContent);

function isProjectStatus(value: string | null): value is ProjectStatus {
  return value === "active" || value === "on_hold" || value === "completed";
}
export default function ProjectListPage() {
  const [state, setSate] = useState<LoadState>({ status: "loading" });
  const [retryCount, setRetryCount] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    let cancelled = false;
    // setSate({ status: "loading" });

    fetchProjects()
      .then((projects) => {
        if (!cancelled) setSate({ status: "ready", projects });
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setSate({
            status: "error",
            message:
              error instanceof Error
                ? error.message
                : "Unable to load projects.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [retryCount]);

  const statusParam = searchParams.get("status");
  const query = searchParams.get("q") ?? "";
  const status = isProjectStatus(statusParam) ? statusParam : "all";

  function handleStatusChange(value: string): void {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);

      if (value === "all") {
        next.delete("status");
      } else if (isProjectStatus(value)) {
        next.set("status", value);
      }

      return next;
    });
  }

  function handleQueryChange(value: string): void {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);

      if (value === "") {
        next.delete("q");
      } else {
        next.set("q", value);
      }

      return next;
    });
  }

  const filteredProjects =
    state.status === "ready"
      ? state.projects.filter((project) => {
          const matchesStatus = status === "all" || project.status === status;

          const matchesQuery = project.name
            .toLowerCase()
            .includes(query.trim().toLowerCase());

          return matchesStatus && matchesQuery;
        })
      : [];

  if (state.status === "loading") {
    return <LoadingProjectList isLoading={true} projects={[]} />;
  }

  //   Error state
  if (state.status === "error") {
    return (
      <section>
        <h1>Projects</h1>

        <p className="error" role="alert">
          {state.message}
        </p>

        <button
          type="button"
          onClick={() => {
            setSate({ status: "loading" });
            setRetryCount((previous) => previous + 1);
          }}
        >
          Retry
        </button>
      </section>
    );
  }
  //   Ready state
  return (
    <section>
      <h1>Projects</h1>

      <div className="project-filters">
        <label htmlFor="status-filter">Status</label>

        <select
          id="status-filter"
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="on_hold">On Hold</option>
          <option value="completed">Completed</option>
        </select>

        <label htmlFor="project-search">Search by name</label>

        <input
          id="project-search"
          type="search"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="Search projects..."
        />
      </div>

      <LoadingProjectList isLoading={false} projects={filteredProjects} />
    </section>
  );
}
