import { ArrowUpRight } from "lucide-react";

function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <div className="section-heading">
          <span className="section-number">01</span>
          <div>
            <p className="eyebrow">ABOUT ME</p>
            <h2>
              Build things
              <br />
              <span>that matter.</span>
            </h2>
          </div>
        </div>

        <div className="about-grid">
          <div className="profile-card">
            <div className="image-placeholder">
              <img
                src="/images/profile.jpg"
                alt="장태웅 프로필"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />

              <div className="placeholder-content">
              </div>
            </div>

            <div className="profile-caption">
              <div>
                <strong>장태웅</strong>
                <span>Developer & Founder</span>
              </div>

              <span className="caption-arrow">
                <ArrowUpRight size={18} />
              </span>
            </div>
          </div>

          <div className="about-content">
            <p className="large-text">
             저는 <strong>문제를 발견하고, 기술을 통해 해결하여<br/>​</strong>사회적 가치를 만들어내는 것에 관심이 많습니다.
            </p>

            <p>
              한국디지털미디어고등학교 웹프로그래밍과에서 웹과 소프트웨어 개발을
              배우며, 기술을 활용해 문제를 구체적인 해결책으로 발전시키는 과정을
              경험하고 있습니다. 또한 다양한 창업 프로젝트와 학생 창업 활동을 통해
              아이디어를 기획하고, 실제 서비스를 설계하고, 직접 프로덕트로
              구현하는 경험을 쌓고 있습니다.
            </p>

            <p>
              문제를 발견하는 순간부터 해결 방법을 고민하고 기획하여
              하나의 제품으로 완성하는 개발자를 지향합니다.
              기술 자체에 머무르지 않고, 기술이 사람과 사회에 실질적인 변화를
              만들어낼 수 있도록 고민하며 성장하고 있습니다.
            </p>

            <div className="about-stats">
              <div>
                <strong>24th</strong>
                <span>DIMIGO WEB</span>
              </div>

              <div>
                <strong>8th</strong>
                <span>LUNA</span>
              </div>

              <div>
                <strong>2027</strong>
                <span>ROBOFEST KOREA</span>
              </div>
            </div>
          </div>
        </div>

        <div className="activity-grid">
          <div className="activity-card">
            <span className="activity-label">SCHOOL</span>
            <h3>한국디지털미디어고등학교</h3>
            <p>웹프로그래밍과 24th</p>
          </div>

          <div className="activity-card">
            <span className="activity-label">STUDENT COUNCIL</span>
            <h3>24대 학생자치회</h3>
            <p>부회장</p>
          </div>

          <div className="activity-card">
            <span className="activity-label">STARTUP</span>
            <h3>LUNA</h3>
            <p>8기 · 2026 창업동아리장</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;