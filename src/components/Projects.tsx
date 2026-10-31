import { Suspense, lazy, useState } from "react";
import { ArrowUpRight, FileText, FileX2, Loader2 } from "lucide-react";
import { projects } from "../data/portfolio";
import type { ProjectItem } from "./ProjectModal";

const ProjectModal = lazy(() => import("./ProjectModal"));

function Projects() {
  const [selected, setSelected] = useState<ProjectItem | null>(null);

  return (
    <section id="projects" className="section">
      <div className="container">
        <div className="section-heading">
          <span className="section-number">03</span>

          <div>
            <p className="eyebrow">SELECTED WORK</p>

            <h2>
              Projects
              <br />
              <span>& Experiences.</span>
            </h2>
          </div>
        </div>

        <div className="projects-list">
          {projects.map((project) => (
            <article
              className="project-card project-clickable"
              key={project.name}
              onClick={() => setSelected(project as ProjectItem)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelected(project as ProjectItem);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`${project.name} 상세 보기`}
            >
              <div className="project-top">
                <span className="project-number">
                  {project.number}
                </span>

                <span className="project-pdf-badge">
                  {project.slides ? (
                    <>
                      <FileText size={12} />
                      PPT 보기
                    </>
                  ) : (
                    <>
                      <FileX2 size={12} />
                      피피티 없음
                    </>
                  )}
                </span>

                <span className="project-role">
                  {project.role}
                </span>
              </div>

              <div className="project-main">
                <div>
                  <h3>{project.name}</h3>

                  <p>{project.description}</p>
                </div>

                <div className="project-arrow">
                  <ArrowUpRight size={24} />
                </div>
              </div>

              <div className="project-tags">
                {project.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>

      {selected && (
        <Suspense
          fallback={
            <div className="project-modal-overlay">
              <div className="project-modal pm-loading">
                <Loader2 size={32} className="pm-spinner" />
                <p>불러오는 중…</p>
              </div>
            </div>
          }
        >
          <ProjectModal
            key={selected.name}
            project={selected}
            onClose={() => setSelected(null)}
          />
        </Suspense>
      )}
    </section>
  );
}

export default Projects;