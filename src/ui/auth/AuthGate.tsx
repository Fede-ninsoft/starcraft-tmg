import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ApiError, requestPasswordReset, requestVerification, resetPassword, verifyEmail } from '@/auth/authService';
import { googleSignInEnabled } from '@/auth/googleIdentity';
import { useAuthStore } from '@/store/authStore';
import { useListStore } from '@/store/listStore';
import { GoogleSignInButton } from './GoogleSignInButton';
import { TermsPage } from './TermsPage';
import { localizedPath, pageFromPath, routeLocale } from '@/i18n/routing';
import { LanguageSelector } from '../common/LanguageSelector';
import { AppVersion } from '../common/AppVersion';
import { ChangelogLink } from '../common/ChangelogLink';
import { NavigationIcon } from '../common/NavigationIcon';

export function AuthGate({ children }: { children: ReactNode }) {
  const location = useLocation();
  const page = pageFromPath(location.pathname);
  const locale = routeLocale(location.pathname);
  const { status, user, developmentVerificationUrl, emailDeliveryWarning } = useAuthStore();
  const navigationState = location.state as AuthNavigationState | null;
  const destination = safeReturnTo(navigationState?.returnTo, locale);
  const destinationState = navigationState?.preserveGuestDraft ? { preserveGuestDraft: true } : null;
  if (page === 'terms') return <TermsPage />;
  if (status === 'checking') return <AuthLoading />;
  if (page === 'verify-email') return <VerifyEmail />;
  if (page === 'reset-password') return <ResetPassword />;
  if (page === 'login') {
    if (status === 'authenticated') return <Navigate to={destination} state={destinationState} replace />;
    if (status === 'unverified') return <Navigate to={localizedPath('check-email', locale)} state={navigationState} replace />;
    return <AuthForm mode="login" />;
  }
  if (page === 'register') {
    if (status === 'authenticated') return <Navigate to={destination} state={destinationState} replace />;
    if (status === 'unverified') return <Navigate to={localizedPath('check-email', locale)} state={navigationState} replace />;
    return <AuthForm mode="register" />;
  }
  if (page === 'check-email') {
    if (status === 'authenticated') return <Navigate to={destination} state={destinationState} replace />;
    if (status === 'unverified') return <UnverifiedEmail email={user?.email ?? ''} warning={emailDeliveryWarning} developmentVerificationUrl={developmentVerificationUrl} />;
    return <Navigate to={localizedPath('register', locale)} replace />;
  }
  if (status === 'authenticated') return <>{children}</>;
  if (status === 'unverified') return <UnverifiedEmail email={user?.email ?? ''} warning={emailDeliveryWarning} developmentVerificationUrl={developmentVerificationUrl} />;
  return <Navigate to={localizedPath('login', locale)} state={{ returnTo: `${location.pathname}${location.search}${location.hash}` }} replace />;
}

export interface AuthNavigationState {
  returnTo?: string;
  preserveGuestDraft?: boolean;
}

function safeReturnTo(value: string | undefined, locale: 'es' | 'en'): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return localizedPath('home', locale);
  const page = pageFromPath(new URL(value, 'https://local.invalid').pathname);
  return page === 'login' || page === 'register' ? localizedPath('home', locale) : value;
}

function AuthLayout({ children }: { children: ReactNode }) {
  return <AuthShell mainClassName="auth-page__main--compact"><section className="panel stack auth-page__panel auth-page__panel--single">{children}</section></AuthShell>;
}

function AuthShell({ children, mainClassName = '' }: { children: ReactNode; mainClassName?: string }) {
  const { t } = useTranslation('common');
  const location = useLocation();
  const navigate = useNavigate();
  const locale = routeLocale(location.pathname);
  return <div className="auth-page">
    <header className="topbar app-header auth-page__header no-print">
      <button type="button" className="topbar__brand" aria-label={t('appName')} onClick={() => navigate(localizedPath('home', locale))}>
        <img className="topbar__logo" src="/logo.png" alt="" width={521} height={149} />
      </button>
      <AuthNavigation />
      <div className="topbar__spacer" />
      <div className="topbar__account"><LanguageSelector /></div>
    </header>
    <main className={`auth-page__main ${mainClassName}`.trim()}><AuthBrand />{children}</main>
    <AuthFooter />
  </div>;
}

function AuthNavigation() {
  const { t } = useTranslation('navigation');
  const race = useListStore((state) => state.list.race);
  const location = useLocation();
  const locale = routeLocale(location.pathname);
  const page = pageFromPath(location.pathname);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      navRef.current?.querySelectorAll<HTMLDetailsElement>('details[open]').forEach((menu) => {
        if (!menu.contains(event.target as Node)) menu.open = false;
      });
    };
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, []);

  const closeOnNavigate = (event: MouseEvent<HTMLAnchorElement>) => {
    event.currentTarget.closest<HTMLDetailsElement>('.primary-nav__rules')?.removeAttribute('open');
    event.currentTarget.closest<HTMLDetailsElement>('.primary-nav__mobile')?.removeAttribute('open');
  };
  const closeOnEscape = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Escape') return;
    const menu = (event.target as HTMLElement).closest<HTMLDetailsElement>('details[open]');
    if (!menu) return;
    event.stopPropagation();
    menu.open = false;
    menu.querySelector('summary')?.focus();
  };
  const icons = { home: 'inicio', lists: 'mis-listas', builder: 'nueva-lista', tournaments: 'torneos', games: 'partidas', 'public-lists': 'listas-publicas', faqs: 'preguntas', 'organised-play': 'juego-organizado', support: 'contacto' } as const;
  const link = (target: keyof typeof icons, label: string, className = 'primary-nav__item') => <Link
    key={target}
    to={localizedPath(target, locale)}
    className={`${className}${page === target ? ` ${className}--active` : ''}`}
    aria-current={page === target ? 'page' : undefined}
    onClick={closeOnNavigate}
  ><NavigationIcon race={race} icon={icons[target]} /><span>{t(label)}</span></Link>;
  const group = (label: string, icon: string, targets: Array<['lists' | 'builder' | 'faqs' | 'organised-play', string]>, active: boolean) => <details className="primary-nav__rules">
    <summary aria-label={t(label)} className={`primary-nav__item${active ? ' primary-nav__item--active' : ''}`}><NavigationIcon race={race} icon={icon} /><span>{t(label)}</span><span className="primary-nav__chevron" aria-hidden="true">⌄</span></summary>
    <div className="primary-nav__rules-menu">{targets.map(([target, itemLabel]) => link(target, itemLabel))}</div>
  </details>;
  const lists = () => group('lists', 'mis-listas', [['lists', 'lists'], ['builder', 'newList']], page === 'lists' || page === 'builder');
  const rules = () => group('rules', 'reglas', [['faqs', 'faqs'], ['organised-play', 'organisedPlay']], page === 'faqs' || page === 'organised-play');

  return <nav ref={navRef} className="primary-nav auth-page__navigation" aria-label={t('main')} onKeyDown={closeOnEscape}>
    <div className="primary-nav__buttons">
      {link('home', 'home')}
      {lists()}
      {link('tournaments', 'tournaments')}
      {link('games', 'games')}
      {link('public-lists', 'publicLists')}
      {rules()}
    </div>
    <span className="primary-nav__divider" aria-hidden="true" />
    {link('support', 'support', 'primary-nav__support')}
    <details className="primary-nav__mobile">
      <summary>{t('main')}</summary>
      <div className="primary-nav__mobile-menu">
        {link('home', 'home', 'primary-nav__mobile-item')}
        {lists()}
        {link('tournaments', 'tournaments', 'primary-nav__mobile-item')}
        {link('games', 'games', 'primary-nav__mobile-item')}
        {link('public-lists', 'publicLists', 'primary-nav__mobile-item')}
        {rules()}
        {link('support', 'support', 'primary-nav__mobile-item')}
      </div>
    </details>
  </nav>;
}

function AuthBrand() {
  return <header className="auth-page__brand"><img className="auth-page__logo" src="/logo.png" alt="StarCraft: The Miniatures Game" width={521} height={149} /><span className="auth-page__brand-line" aria-hidden="true" /></header>;
}

function AuthLoading() {
  const { t } = useTranslation('common');
  return <AuthShell mainClassName="auth-page__main--loading"><span className="sr-only" role="status">{t('loading')}</span></AuthShell>;
}

function AuthFooter() {
  const { t: tLegal } = useTranslation('legal');
  const { t: tNavigation } = useTranslation('navigation');
  const location = useLocation();
  const locale = routeLocale(location.pathname);
  return <footer className="auth-page__footer"><span>{tLegal('footer')}</span><span className="auth-page__footer-links"><a href={localizedPath('tournaments', locale)}>{tNavigation('tournaments')}</a><span aria-hidden="true">·</span><a href={localizedPath('support', locale)}>{tNavigation('support')}</a><span aria-hidden="true">·</span><a href={localizedPath('terms', locale)}>{tLegal('terms')}</a><span aria-hidden="true">·</span><ChangelogLink /><span aria-hidden="true">·</span><AppVersion /></span></footer>;
}

export function AuthModeTabs({ mode, locale, loginLabel, registerLabel, accessModeLabel, disabled, navigationState = null }: {
  mode: 'login' | 'register';
  locale: 'es' | 'en';
  loginLabel: string;
  registerLabel: string;
  accessModeLabel: string;
  disabled: boolean;
  navigationState?: AuthNavigationState | null;
}) {
  return <div className="auth-page__mode-tabs" role="tablist" aria-label={accessModeLabel}>
    <Link role="tab" aria-selected={mode === 'login'} aria-controls="auth-form" className="auth-mode-tab" to={localizedPath('login', locale)} state={navigationState} aria-disabled={disabled || undefined} onClick={(event) => { if (disabled) event.preventDefault(); }}>{loginLabel}</Link>
    <Link role="tab" aria-selected={mode === 'register'} aria-controls="auth-form" className="auth-mode-tab" to={localizedPath('register', locale)} state={navigationState} aria-disabled={disabled || undefined} onClick={(event) => { if (disabled) event.preventDefault(); }}>{registerLabel}</Link>
  </div>;
}

function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const { t } = useTranslation('auth');
  const location = useLocation();
  const locale = routeLocale(location.pathname);
  const navigate = useNavigate();
  const navigationState = location.state as AuthNavigationState | null;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [googleTermsRequired, setGoogleTermsRequired] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (mode === 'register' && !termsAccepted) {
      setError(t('termsRequired'));
      return;
    }
    setError(null);
    setPending(true);
    try {
      if (mode === 'login') await login(email, password);
      else {
        await register(email, password);
        navigate(localizedPath('check-email', locale), { replace: true, state: navigationState });
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : t('genericError'));
    } finally {
      setPending(false);
    }
  };

  const enterWithGoogle = async (credential: string) => {
    if (pending) return;
    if ((mode === 'register' || googleTermsRequired) && !termsAccepted) {
      setError(t('termsRequired'));
      return;
    }
    setError(null);
    setPending(true);
    try {
      await loginWithGoogle(credential, termsAccepted);
    } catch (reason) {
      if (reason instanceof ApiError && reason.code === 'TERMS_REQUIRED') {
        setGoogleTermsRequired(true);
      }
      setError(reason instanceof Error ? reason.message : t('googleError'));
    } finally {
      setPending(false);
    }
  };

  return (
    <AuthShell mainClassName="auth-page__main--compact">
      <div className="auth-page__panels auth-page__panels--single">
        <section className="panel stack auth-page__panel auth-page__panel--account">
          <h1>{mode === 'login' ? t('login') : t('register')}</h1>
          <form id="auth-form" className="stack auth-form" onSubmit={submit}>
            <label className="field">
              {t('email')}
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" />
            </label>
            <label className="field">
              {t('password')}
              <span className="password-field">
                <input type={passwordVisible ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} required minLength={12} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
                <button type="button" className="password-field__toggle" onClick={() => setPasswordVisible((visible) => !visible)} aria-label={passwordVisible ? t('hidePassword') : t('showPassword')} aria-pressed={passwordVisible}>{passwordVisible ? t('hidePassword') : t('showPassword')}</button>
              </span>
            </label>
            {(mode === 'register' || googleTermsRequired) && (
              <label className="terms-check">
                <input type="checkbox" checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)} required={mode === 'register'} />
                <span>{t('acceptTermsPrefix')} <Link to={localizedPath('terms', locale)}>{t('acceptTermsLink')}</Link>.</span>
              </label>
            )}
            {error && <p className="issue issue--error">{error}</p>}
            <button className="auth-action auth-action--primary" type="submit" disabled={pending}>{pending ? t('processing') : mode === 'login' ? t('enter') : t('registerAction')}</button>
          </form>
          {googleSignInEnabled && <><p className="auth-separator">{t('or')}</p><GoogleSignInButton text={mode === 'login' ? 'signin_with' : 'signup_with'} onCredential={(credential) => { void enterWithGoogle(credential); }} locale={locale} /><p className="muted small">{t('googleNote')}</p></>}
          <div className="auth-page__account-links">
            {mode === 'login' && <Link to={localizedPath('reset-password', locale)}> {t('forgotPassword')}</Link>}
            <AuthModeTabs mode={mode} locale={locale} loginLabel={t('login')} registerLabel={t('register')} accessModeLabel={t('accessMode')} disabled={pending} navigationState={navigationState} />
          </div>
        </section>
      </div>
    </AuthShell>
  );
}

function UnverifiedEmail({ email, warning, developmentVerificationUrl }: { email: string; warning: string | null; developmentVerificationUrl: string | null }) {
  const { t } = useTranslation('auth');
  const locale = routeLocale(window.location.pathname);
  const [message, setMessage] = useState<string | null>(warning); const [pending, setPending] = useState(false);
  const resend = async () => { setPending(true); setMessage(null); try { await requestVerification(email, locale); setMessage(t('resendConfirmation')); } catch (error) { setMessage(error instanceof Error ? error.message : t('genericError')); } finally { setPending(false); } };
  return <AuthLayout><h1>{t('verifyTitle')}</h1><p>{t('verifyMessage')}</p>{message && <p className="issue issue--error">{message}</p>}<button className="auth-action auth-action--primary" onClick={() => { void resend(); }} disabled={pending || !email}>{pending ? t('requesting') : t('resend')}</button>{developmentVerificationUrl && <a href={developmentVerificationUrl}>{t('verifyLocal')}</a>}</AuthLayout>;
}

function ResetPassword() {
  const { t } = useTranslation('auth');
  const locale = routeLocale(window.location.pathname);
  const token = new URLSearchParams(window.location.search).get('token'); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [message, setMessage] = useState<string | null>(null); const [pending, setPending] = useState(false);
  const submitRequest = async (event: FormEvent) => { event.preventDefault(); setPending(true); setMessage(null); try { await requestPasswordReset(email, locale); setMessage(t('resetRequestConfirmation')); } catch (error) { setMessage(error instanceof Error ? error.message : t('genericError')); } finally { setPending(false); } };
  const submitReset = async (event: FormEvent) => { event.preventDefault(); setPending(true); setMessage(null); try { await resetPassword(token!, password); setMessage(t('passwordUpdated')); } catch (error) { setMessage(error instanceof Error ? error.message : t('genericError')); } finally { setPending(false); } };
  return <AuthLayout><h1>{token ? t('resetTitle') : t('recoverTitle')}</h1><form className="stack auth-form" onSubmit={token ? submitReset : submitRequest}>{token ? <label className="field">{t('newPassword')}<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={12} autoComplete="new-password" required /></label> : <label className="field">{t('email')}<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label>}{message && <p className="issue">{message}</p>}<button className="auth-action auth-action--primary" type="submit" disabled={pending}>{pending ? t('processing') : token ? t('savePassword') : t('sendLink')}</button></form><a href={localizedPath('login', locale)}>{t('backToAccess')}</a></AuthLayout>;
}

function VerifyEmail() {
  const { t } = useTranslation('auth');
  const locale = routeLocale(window.location.pathname);
  const [message, setMessage] = useState(t('verifying'));
  useEffect(() => { const token = new URLSearchParams(window.location.search).get('token'); if (!token) { setMessage(t('invalidVerification')); return; } void verifyEmail(token).then(() => setMessage(t('emailVerified'))).catch((error: Error) => setMessage(error.message)); }, [t]);
  return <AuthLayout><p>{message}</p><a href={localizedPath('login', locale)}>{t('backToAccess')}</a></AuthLayout>;
}
