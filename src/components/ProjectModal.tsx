import { useCallback, useEffect, useRef, useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  FileX2,
  ExternalLink,
  Download,
  Loader2,
} from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import type { PDFDocumentProxy } from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

export interface ProjectItem {
  number: string;
  name: string;
  role: string;
  description: string;
  tags: string[];
  pdf: string | null;
}

interface ProjectModalProps {
  project: ProjectItem;
  onClose: () => void;
}

const AUTOPLAY_MS = 4000;

function PdfPage({
  doc,
  pageNumber,
  active,
}: {
  doc: PDFDocumentProxy;
  pageNumber: number;
  active: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const render = async () => {
      if (!active) return;
      try {
        const page = await doc.getPage(pageNumber);
        if (cancelled) return;
        const viewport = page.getViewport({ scale: 2 });
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvas, viewport }).promise;
        page.cleanup();
      } catch {
        if (!cancelled) setError(true);
      }
    };
    // active가 아니어도 레이아웃 유지를 위해 캔버스는 렌더, 실제 렌더는 active 근처에서만
    render();
    return () => {
      cancelled = true;
    };
  }, [doc, pageNumber, active]);

  if (error) {
    return (
      <div className="pdf-page-error">
        <span>페이지를 불러오지 못했어요</span>
      </div>
    );
  }

  return <canvas ref={canvasRef} className="pdf-canvas" />;
}

function ProjectModal({ project, onClose }: ProjectModalProps) {
  const hasPdf = Boolean(project.pdf);
  const pdfUrl = hasPdf
    ? `${import.meta.env.BASE_URL}my_projects/${encodeURIComponent(project.pdf as string)}`
    : null;

  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(hasPdf);
  const [progress, setProgress] = useState(0);
  const [loadError, setLoadError] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [pausedByHover, setPausedByHover] = useState(false);
  const [touchX, setTouchX] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

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

  // PDF 로드 (마운트 시 1회 — 프로젝트가 바뀌면 key로 리마운트됨)
  useEffect(() => {
    if (!pdfUrl) return;
    let cancelled = false;
    let loadingTask: ReturnType<typeof pdfjsLib.getDocument> | null = null;

    try {
      loadingTask = pdfjsLib.getDocument({
        url: pdfUrl,
        // 외부 CDN 대신 사이트와 함께 배포되는 로컬 CMap 사용 (오프라인/차단 환경에서도 한글 렌더 안정)
        cMapUrl: `${import.meta.env.BASE_URL}cmaps/`,
        cMapPacked: true,
      });
      loadingTask.onProgress = (data: { loaded: number; total: number }) => {
        if (!cancelled && data.total > 0) {
          setProgress(Math.round((data.loaded / data.total) * 100));
        }
      };
      loadingTask.promise.then(
        (loadedDoc) => {
          if (cancelled) {
            loadedDoc.cleanup().catch(() => {});
            return;
          }
          setDoc(loadedDoc);
          docRef.current = loadedDoc;
          setNumPages(loadedDoc.numPages);
          setLoading(false);
        },
        () => {
          if (!cancelled) {
            setLoading(false);
            setLoadError(true);
          }
        }
      );
    } catch {
      // getDocument() 동기 예외 — 마운트 시 1회성 폴백이므로 허용
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoadError(true);
      setLoading(false);
    }

    return () => {
      cancelled = true;
      loadingTask?.destroy().catch(() => {});
    };
  }, [pdfUrl]);

  // doc 정리
  const docRef = useRef<PDFDocumentProxy | null>(null);
  useEffect(() => {
    return () => {
      docRef.current?.cleanup().catch(() => {});
    };
  }, []);

  // 자동 슬라이드
  useEffect(() => {
    if (!playing || pausedByHover || loading || loadError || numPages <= 1) return;
    const id = window.setInterval(() => {
      setCurrent((c) => (c + 1) % numPages);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [playing, pausedByHover, loading, loadError, numPages]);

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
          {!hasPdf ? (
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
          ) : loading ? (
            <div className="pm-loading">
              <Loader2 size={36} className="pm-spinner" />
              <p>발표 자료 불러오는 중{progress > 0 ? ` · ${progress}%` : "…"}</p>
              <div className="pm-loading-bar">
                <div
                  className="pm-loading-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="pm-loading-name">{project.pdf}</span>
            </div>
          ) : loadError || !doc ? (
            <div className="pm-empty">
              <div className="pm-empty-icon">
                <FileX2 size={40} strokeWidth={1.5} />
              </div>
              <p className="pm-empty-title">PDF를 불러오지 못했어요</p>
              <p className="pm-empty-desc">
                파일이 크거나 네트워크가 느릴 수 있어요.
                <br />
                새 창에서 직접 열어보세요.
              </p>
              {pdfUrl && (
                <a
                  className="button button-secondary pm-retry"
                  href={pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExternalLink size={15} />
                  새 창에서 보기
                </a>
              )}
            </div>
          ) : (
            <>
              <div className="pm-stage">
                <div
                  ref={trackRef}
                  className="pm-track"
                  style={{ transform: `translateX(-${current * 100}%)` }}
                >
                  {Array.from({ length: numPages }, (_, i) => (
                    <div className="pm-slide" key={i}>
                      <PdfPage
                        doc={doc}
                        pageNumber={i + 1}
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
            {pdfUrl && (
              <div className="pm-actions">
                <a
                  className="button button-primary"
                  href={pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExternalLink size={15} />
                  전체화면으로 보기
                </a>
                <a
                  className="button button-secondary"
                  href={pdfUrl}
                  download={project.pdf ?? undefined}
                >
                  <Download size={15} />
                  PDF 다운로드
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
