import { awards } from "../data/portfolio";
import { Award, ExternalLink } from "lucide-react";

function Awards() {
  return (
    <section id="awards" className="section section-dark">
      <div className="container">
        <div className="section-heading">
          <span className="section-number">02</span>

          <div>
            <p className="eyebrow">ACHIEVEMENTS</p>

            <h2>
              Awards &
              <br />
              <span>Recognition.</span>
            </h2>
          </div>
        </div>

        <div className="awards-list">
          {awards.map((award, index) => (
            <article className="award-card" key={award.title}>
              <div className="award-index">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="award-image">
                <img
                  src={award.image}
                  alt={award.title}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />

                <div className="image-fallback">
                  <Award size={26} />
                  <span>AWARD IMAGE</span>
                </div>
              </div>

              <div className="award-info">
                <span className="award-year">{award.year}</span>

                <h3>{award.title}</h3>

                <p>{award.organization}</p>
              </div>

              <ExternalLink className="award-icon" size={19} />
            </article>
          ))}
        </div>

        <div className="future-achievement">
          <div className="future-image">
            <img
              src="/images/robofest.jpg"
              alt="2027 RoboFest"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />

            <div className="image-fallback">
              <span>ROBOFEST IMAGE</span>
              <small>public/images/robofest.jpg</small>
            </div>
          </div>

          <div className="future-content">
            <span className="eyebrow">UPCOMING</span>

            <h3>
              2027 RoboFest
              <br />
              <span>High School Division</span>
            </h3>

            <p>
              2027 RoboFest 고등부
              <br />
              대한민국 대표 출전
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Awards;