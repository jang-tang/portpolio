import { useCallback, useEffect, useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  FileX2,
  ExternalLink,
} from "lucide-react";

export interface ProjectSlides {
  folder: string;
  pages: number;
}

export interface ProjectItem {
  number: string;
  name: string;
  role: string;
  description: string;
  tags: string[];
  slides: ProjectSlides | null;
}

interface ProjectModalProps {
  project: ProjectItem;
  onClose: () => void;
}

const AUTOPLAY_MS = 4000;

function slideUrl(slides: ProjectSlides, index: number) {
  return `${import.meta.env.BASE_URL}slides/${slides.folder}/${String(index + 1).padStart(2, "0")}.jpg`;
}

function SlideImage({
  src,
  alt,
  active,
}: {
  src: string;
  alt: string;
  active: boolean;
}) {
  // 현재 페이지 근처에 한 번이라도 온 슬라이드만 이미지를 불러오고, 이후엔 유지
  const [visible, setVisible] = useState(active);
  const [error, setError] = useState(false);
  if (active && !visible) setVisible(true);

  if (error) {
    return (
      <div className="pdf-page-error">
        <span>페이지를 불러오지 못했어요</span>
      </div>
    );
  }

  if (!visible) return null;

  return (
    <img
      src={src}
      alt={alt}
      className="pdf-canvas"
      decoding="async"
      onError={() => setError(true)}
    />
  );
}

function ProjectModal({ project, onClose }: ProjectModalProps) {
  const slides = project.slides;
  const numPages = slides?.pages ?? 0;

  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [pausedByHover, setPausedByHover] = useState(false);
  const [touchX, setTouchX] = useState<number | null>(null);

  const goTo = useCallback(
    (index: number) => {
      if (numPages === 0) return;
      const next = (index + numPages) % numPages;
      setCurrent(next);
    },
    [numPages]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // 자동 슬라이드
  useEffect(() => {
    if (!playing || pausedByHover || numPages <= 1) return;
    const id = window.setInterval(() => {
      setCurrent((c) => (c + 1) % numPages);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [playing, pausedByHover, numPages]);

  // ESC / 방향키 / 스크롤 잠금
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === " ") {
        e.preventDefault();
        setPlaying((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, next, prev]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchX(e.touches[0].clientX);
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (dx > 40) prev();
    else if (dx < -40) next();
    setTouchX(null);
  };

  const isPlaying = playing && !pausedByHover && numPages > 1;

  return (
    <div
      className="project-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} 상세`}
    >
      <div
        className="project-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="pm-header">
          <div className="pm-header-left">
            <span className="pm-number">{project.number}</span>
            <div>
              <p className="pm-eyebrow">{project.role}</p>
              <h3>{project.name}</h3>
            </div>
          </div>
          <button className="pm-close" onClick={onClose} aria-label="닫기">
            <X size={20} />
          </button>
        </div>

        {/* 뷰어 */}
        <div
          className="pm-viewer"
          onMouseEnter={() => setPausedByHover(true)}
          onMouseLeave={() => setPausedByHover(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {!slides ? (
            <div className="pm-empty">
              <div className="pm-empty-icon">
                <FileX2 size={40} strokeWidth={1.5} />
              </div>
              <p className="pm-empty-title">피피티 없음</p>
              <p className="pm-empty-desc">
                이 프로젝트는 발표 자료가 준비되지 않았어요.
                <br />
                아래 간략한 설명을 참고해 주세요.
              </p>
            </div>
          ) : (
            <>
              <div className="pm-stage">
                <div
                  className="pm-track"
                  style={{ transform: `translateX(-${current * 100}%)` }}
                >
                  {Array.from({ length: numPages }, (_, i) => (
                    <div className="pm-slide" key={i}>
                      <SlideImage
                        src={slideUrl(slides, i)}
                        alt={`${project.name} ${i + 1}페이지`}
                        active={Math.abs(i - current) <= 1}
                      />
                    </div>
                  ))}
                </div>

                {numPages > 1 && (
                  <>
                    <button
                      className="pm-nav pm-nav-prev"
                      onClick={prev}
                      aria-label="이전 슬라이드"
                    >
                      <ChevronLeft size={22} />
                    </button>
                    <button
                      className="pm-nav pm-nav-next"
                      onClick={next}
                      aria-label="다음 슬라이드"
                    >
                      <ChevronRight size={22} />
                    </button>
                  </>
                )}

                <div className="pm-counter">
                  <span>
                    {String(current + 1).padStart(2, "0")} /{" "}
                    {String(numPages).padStart(2, "0")}
                  </span>
                </div>
              </div>

              {/* 진행 바 (자동재생) */}
              {numPages > 1 && (
                <div className="pm-progress">
                  <div
                    key={`${current}-${isPlaying}`}
                    className={`pm-progress-fill ${isPlaying ? "animate" : ""}`}
                    style={
                      isPlaying
                        ? { animationDuration: `${AUTOPLAY_MS}ms` }
                        : { width: `${((current + 1) / numPages) * 100}%` }
                    }
                  />
                </div>
              )}

              {/* 컨트롤 */}
              {numPages > 1 && (
                <div className="pm-controls">
                  <button
                    className="pm-play"
                    onClick={() => setPlaying((p) => !p)}
                    aria-label={playing ? "일시정지" : "자동재생"}
                  >
                    {playing ? <Pause size={15} /> : <Play size={15} />}
                    {playing ? "일시정지" : "자동재생"}
                  </button>
                  <div className="pm-dots">
                    {numPages <= 20 ? (
                      Array.from({ length: numPages }, (_, i) => (
                        <button
                          key={i}
                          className={`pm-dot ${i === current ? "active" : ""}`}
                          onClick={() => goTo(i)}
                          aria-label={`${i + 1}페이지로 이동`}
                        />
                      ))
                    ) : (
                      <span className="pm-dots-text">
                        {current + 1} / {numPages}
                      </span>
                    )}
                  </div>
                  <span className="pm-hint">← → 키로 이동</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* 하단 간략 설명 */}
        <div className="pm-body">
          <div className="pm-desc-row">
            <div>
              <p className="pm-label">ABOUT THIS PROJECT</p>
              <p className="pm-desc">{project.description}</p>
              <div className="project-tags pm-tags">
                {project.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
            {slides && (
              <div className="pm-actions">
                <a
                  className="button button-primary"
                  href={slideUrl(slides, current)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExternalLink size={15} />
                  현재 페이지 크게 보기
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectModal;
