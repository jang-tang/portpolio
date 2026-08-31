import { ArrowDown, Mail } from "lucide-react";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-grid" />
      <div className="hero-glow hero-glow-one" />
      <div className="hero-glow hero-glow-two" />

      <div className="container hero-content">
        <div className="hero-badge">
          <span className="status-dot" />
          WEB PROGRAMMING · 24TH
        </div>

        <p className="hero-kicker">DEVELOPER · FOUNDER · PROBLEM SOLVER</p>

        <h1>
          JANG
          <br />
          <span>TAEWOONG.</span>
        </h1>

        <p className="hero-description">
          사회적 문제를 발견하고,
          <br />
          기술로 해결하는 테크 파운더 장태웅입니다.
        </p>

        <div className="hero-meta">
          <span>2009.01.01</span>
          <span className="meta-divider" />
          <span>한국디지털미디어고등학교</span>
          <span className="meta-divider" />
          <span>웹프로그래밍과 24th</span>
        </div>

        <div className="hero-actions">
          <a href="#projects" className="button button-primary">
            View Projects
            <ArrowDown size={17} />
          </a>

          <a
            href="https://github.com/jang-tang"
            target="_blank"
            rel="noreferrer"
            className="button button-secondary"
          >
            GitHub
          </a>

          <a
            href="mailto:t01089405151@gmail.com"
            className="button button-icon"
            aria-label="이메일"
          >
            <Mail size={18} />
          </a>
        </div>
      </div>

      <div className="scroll-indicator">
        <span>SCROLL</span>
        <div />
      </div>
    </section>
  );
}

export default Hero;