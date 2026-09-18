import { techStack } from "../data/portfolio";

function TechStack() {
  const categories = [
    "Frontend",
    "Backend",
    "AI",
    "Database",
    "Mobile",
    "Programming",
  ];

  return (
    <section id="stack" className="section section-dark">
      <div className="container">
        <div className="section-heading">
          <span className="section-number">04</span>

          <div>
            <p className="eyebrow">TECHNOLOGIES</p>

            <h2>
              Tools I
              <br />
              <span>work with.</span>
            </h2>
          </div>
        </div>

        <div className="stack-intro">
          <p>
            하나의 기술에 머무르기보다 문제의 성격에 따라
            적절한 기술을 선택하고 조합하는 것을 중요하게 생각합니다.
          </p>
        </div>

        <div className="tech-grid">
          {techStack.map((tech, index) => (
            <div className="tech-card" key={tech.name}>
              <span>
                {String(index + 1).padStart(2, "0")}
              </span>

              <div>
                <h3>{tech.name}</h3>
                <p>{tech.category}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="category-row">
          {categories.map((category) => (
            <span key={category}>{category}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TechStack;