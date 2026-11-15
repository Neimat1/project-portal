import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import { fetchProject } from "../api/mockApi";
import type { Project } from "../types";

type ProjectDetailsState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "not-found" }
  | { status: "ready"; project: Project };

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

function formatDate(date: string): string {
  return dateFormatter.format(new Date(`${date}T00:00:00Z`));
}

interface ProjectDetailsLoaderProps {
  projectId: string;
}

function ProjectDetailsLoader({ projectId }: ProjectDetailsLoaderProps) {
  const [state, setState] = useState<ProjectDetailsState>({
    status: "loading",
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;

    fetchProject(projectId)
      .then((project) => {
        if (cancelled) return;

        if (project === null) {
          setState({ status: "not-found" });
        } else {
          setState({
            status: "ready",
            project,
          });
        }
      })
      .catch((error: unknown) => {
        if (cancelled) return;

        setState({
          status: "error",
          message:
            error instanceof Error ? error.message : "Unable to load project.",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  function handleBack(): void {
    if (location.state?.fromProjects === true) {
      navigate(-1);
    } else {
      navigate("/dashboard/projects");
    }
  }

  if (state.status === "loading") {
    return <p role="status">Loading project details...</p>;
  }

  if (state.status === "error") {
    return (
      <section>
        <h1>Unable to load project</h1>
        <p className="error" role="alert">
          {state.message}
        </p>

        <button type="button" onClick={handleBack}>
          Back
        </button>
      </section>
    );
  }

  if (state.status === "not-found") {
    return (
      <section>
        <h1>Project not found</h1>

        <button type="button" onClick={handleBack}>
          Back
        </button>
      </section>
    );
  }
  return <ProjectDetailsContent project={state.project} onBack={handleBack} />;
}

interface ProjectDetailsContentProps {
  project: Project;
  onBack: () => void;
}

function ProjectDetailsContent({
  project,
  onBack,
}: ProjectDetailsContentProps) {
  return (
    <section className="project-details">
      <h1>{project.name}</h1>

      <p>{project.description}</p>

      <dl>
        <dt>Status</dt>
        <dd>{project.status.replace("_", " ")}</dd>

        <dt>Owner</dt>
        <dd>{project.ownerName}</dd>

        <dt>Start Date</dt>
        <dd>{formatDate(project.startDate)}</dd>

        <dt>Due Date</dt>
        <dd>{formatDate(project.dueDate)}</dd>
      </dl>

      <button type="button" onClick={onBack}>
        Back
      </button>
    </section>
  );
}

export default function ProjectDetailsPage() {
  const { projectId } = useParams();
  if (!projectId) {
    return <h1>Project not found</h1>;
  }

  return <ProjectDetailsLoader key={projectId} projectId={projectId} />;
}
