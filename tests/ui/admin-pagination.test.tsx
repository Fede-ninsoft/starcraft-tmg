import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import '@/i18n/config';
import { AdminPagination } from '@/ui/account/AdminPagination';

describe('paginación administrativa', () => {
  it('muestra el rango, la página y controles habilitados entre los límites', () => {
    const html = renderToStaticMarkup(<AdminPagination
      pagination={{ page: 2, pageSize: 20, total: 53, totalPages: 3 }}
      sectionLabel="Usuarios"
      onPageChange={vi.fn()}
    />);

    expect(html).toContain('Mostrando 21–40 de 53');
    expect(html).toContain('Página 2 de 3');
    expect(html).toContain('aria-label="Paginación de Usuarios"');
    expect(html).not.toContain('disabled=""');
  });

  it('no añade controles cuando sólo hay una página', () => {
    expect(renderToStaticMarkup(<AdminPagination
      pagination={{ page: 1, pageSize: 20, total: 12, totalPages: 1 }}
      sectionLabel="Usuarios"
      onPageChange={vi.fn()}
    />)).toBe('');
  });
});
