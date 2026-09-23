import { useTranslation } from 'react-i18next';
import type { AdminPagination as AdminPaginationState } from '@/auth/authService';

interface AdminPaginationProps {
  pagination: AdminPaginationState;
  sectionLabel: string;
  disabled?: boolean;
  onPageChange: (page: number) => void;
}

export function AdminPagination({ pagination, sectionLabel, disabled = false, onPageChange }: AdminPaginationProps) {
  const { t } = useTranslation('admin');
  const { page, pageSize, total, totalPages } = pagination;
  if (totalPages <= 1) return null;

  const firstItem = ((page - 1) * pageSize) + 1;
  const lastItem = Math.min(page * pageSize, total);

  return <nav className="admin-pagination" aria-label={t('paginationLabel', { section: sectionLabel })}>
    <span className="admin-pagination__status" aria-live="polite">
      {t('paginationRange', { from: firstItem, to: lastItem, total })}
    </span>
    <div className="admin-pagination__actions">
      <button type="button" disabled={disabled || page <= 1} onClick={() => onPageChange(page - 1)}>
        {t('paginationPrevious')}
      </button>
      <span>{t('paginationPage', { page, totalPages })}</span>
      <button type="button" disabled={disabled || page >= totalPages} onClick={() => onPageChange(page + 1)}>
        {t('paginationNext')}
      </button>
    </div>
  </nav>;
}
