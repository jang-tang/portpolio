import { ArrowUpRight, Mail } from "lucide-react";

function Contact() {
  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <div className="contact-box">
          <div className="contact-glow" />

          <div className="contact-content">
            <span className="eyebrow">GET IN TOUCH</span>

            <h2>
              Have an idea?
              <br />
              <span>Let's build it.</span>
            </h2>

            <p>
              새로운 아이디어, 프로젝트, 협업에 대해
              이야기하고 싶다면 언제든 연락해주세요.
            </p>

            <div className="contact-actions">
              <a
                href="mailto:t01089405151@gmail.com"
                className="contact-link"
              >
                <Mail size={20} />
                t01089405151@gmail.com
                <ArrowUpRight size={18} />
              </a>

              <a
                href="https://github.com/jang-tang"
                target="_blank"
                rel="noreferrer"
                className="contact-link"
              >
                github.com/jang-tang
                <ArrowUpRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;