import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import './CardImagePreview.css';

export interface CardPreviewImage {
  src: string;
  alt: string;
}

function cardImageUrl(src: string): string {
  const path = src.startsWith('/') ? src : `/${src}`;
  const separator = path.includes('?') ? '&' : '?';
  // Cada build recibe una URL distinta: CacheFirst no debe conservar la ficha
  // anterior cuando el archivo WebP se sustituye en la misma ruta.
  return `${path}${separator}build=${encodeURIComponent(__APP_BUILD_ID__)}`;
}

/** Small, deliberately text-free control that can sit beside a card title. */
export function CardPreviewButton({
  cardName,
  onOpen,
}: {
  cardName: string;
  onOpen: () => void;
}) {
  const { t } = useTranslation('builderUi');
  const label = t('viewOriginalCard', { name: cardName });
  return (
    <button
      type="button"
      className="card-preview-button"
      aria-haspopup="dialog"
      aria-label={label}
      title={label}
      onClick={onOpen}
    >
      <svg className="card-preview-button__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="10.8" cy="10.8" r="6.4" />
        <path d="m16 16 5 5" />
      </svg>
    </button>
  );
}

/**
 * Accessible, scrollable image viewer shared by every selection catalogue.
 * The optional children are rendered after the original image(s), which lets
 * tactical cards retain their localized reconstructed detail below the source
 * image without duplicating modal behaviour.
 */
export function CardImageModal({
  title,
  images,
  onClose,
  children,
}: {
  title: string;
  images: CardPreviewImage[];
  onClose: () => void;
  children?: ReactNode;
}) {
  const { t } = useTranslation('builderUi');
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const [failedImages, setFailedImages] = useState<Set<number>>(() => new Set());
  const [zoomedIndex, setZoomedIndex] = useState<number | null>(null);
  const zoomedIndexRef = useRef(zoomedIndex);
  const onCloseRef = useRef(onClose);
  zoomedIndexRef.current = zoomedIndex;
  onCloseRef.current = onClose;

  useEffect(() => {
    openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        if (zoomedIndexRef.current !== null) {
          setZoomedIndex(null);
        } else {
          onCloseRef.current();
        }
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.getClientRects().length > 0);
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }
      const first = focusable.at(0);
      const last = focusable.at(-1);
      if (!first || !last) {
        event.preventDefault();
        return;
      }
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      openerRef.current?.focus();
    };
  }, []);

  const markFailed = (index: number) => {
    setFailedImages((current) => {
      const next = new Set(current);
      next.add(index);
      return next;
    });
  };

  return (
    <div
      className="modal card-image-modal no-print"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          if (zoomedIndex !== null) setZoomedIndex(null);
          else onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        className={`modal__box modal__box--card-preview card-image-modal__box${zoomedIndex !== null ? ' card-image-modal__box--zoomed' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal__header card-image-modal__header">
          <div>
            <p className="eyebrow">{t('preview')}</p>
            <h2 id={titleId}>{title}</h2>
            {zoomedIndex !== null && <p className="card-image-modal__zoom-hint">{t('cardImageZoomHint')}</p>}
          </div>
          <button
            ref={closeRef}
            type="button"
            className="card-action modal__close"
            onClick={onClose}
            aria-label={t('closeCardPreview')}
            title={t('closeCardPreview')}
          >
            <span className="card-action__icon" aria-hidden="true">×</span>
          </button>
        </div>

        <div className={`card-image-modal__images${zoomedIndex !== null ? ' card-image-modal__images--zoomed' : ''}`}>
          {images.map((image, index) => (
            <figure
              className={`card-image-modal__figure${zoomedIndex === index ? ' card-image-modal__figure--zoomed' : ''}`}
              key={`${image.src}-${index}`}
              hidden={zoomedIndex !== null && zoomedIndex !== index}
            >
              <button
                type="button"
                className="card-image-modal__image-button"
                aria-label={t(zoomedIndex === index ? 'reduceCardImage' : 'enlargeCardImage', { name: image.alt })}
                aria-pressed={zoomedIndex === index}
                title={t(zoomedIndex === index ? 'reduceCardImage' : 'enlargeCardImage', { name: image.alt })}
                disabled={failedImages.has(index)}
                onClick={() => setZoomedIndex((current) => current === index ? null : index)}
              >
                <img
                  src={cardImageUrl(image.src)}
                  alt=""
                  loading="eager"
                  decoding="async"
                  onError={() => markFailed(index)}
                />
              </button>
              {failedImages.has(index) && (
                <figcaption className="card-image-modal__error" role="status">
                  {t('cardImageLoadError')}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
        {zoomedIndex === null && children}
      </div>
    </div>
  );
}
