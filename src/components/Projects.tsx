import { ArrowUpRight } from "lucide-react";
import { projects } from "../data/portfolio";

function Projects() {
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
            <article className="project-card" key={project.name}>
              <div className="project-top">
                <span className="project-number">
                  {project.number}
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
    </section>
  );
}

export default Projects;