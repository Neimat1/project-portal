import { useEffect, useState } from "react";

import { fetchProjects } from "../api/mockApi";
import type { Project, ProjectStatus } from "../types";

type OverviewState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; projects: Project[] };

type StatusCounts = Record<ProjectStatus, number>;

function countProjectsByStatus(projects: Project[]): StatusCounts {
  return projects.reduce<StatusCounts>(
    (counts, project) => {
      counts[project.status] += 1;
      return counts;
    },
    {
      active: 0,
      on_hold: 0,
      completed: 0,
    },
  );
}
export default function OverviewPage() {
  const [state, setState] = useState<OverviewState>({
    status: "loading",
  });

  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetchProjects()
      .then((projects) => {
        if (!cancelled) {
          setState({
            status: "ready",
            projects,
          });
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({
            status: "error",
            message:
              error instanceof Error
                ? error.message
                : "Unable to load overview.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [retryCount]);

  if (state.status === "loading") {
    return <p role="status">Loading overview...</p>;
  }

  if (state.status === "error") {
    return (
      <section>
        <h1>Dashboard Overview</h1>

        <p className="error" role="alert">
          {state.message}
        </p>

        <button
          type="button"
          onClick={() => {
            setState({ status: "loading" });
            setRetryCount((previous) => previous + 1);
          }}
        >
          Retry
        </button>
      </section>
    );
  }

  const counts = countProjectsByStatus(state.projects);

  return (
    <section>
      <h1>Dashboard Overview</h1>

      <div className="overview-grid">
        <article className="overview-card">
          <h2>Active</h2>
          <p>{counts.active}</p>
        </article>

        <article className="overview-card">
          <h2>On Hold</h2>
          <p>{counts.on_hold}</p>
        </article>

        <article className="overview-card">
          <h2>Completed</h2>
          <p>{counts.completed}</p>
        </article>
      </div>
    </section>
  );
}
