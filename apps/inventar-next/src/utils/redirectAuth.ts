const LOCAL_STORAGE_LAST_PATH = 'auth_last_path';

export const saveLastPath = (url: URL) => {
  if (typeof window === 'undefined') {
    console.warn('saveLastPath: not in browser');
    return;
  }

  const path = url.pathname + url.search;
  if (path.startsWith('/auth')) {
    clearLastPath();
    return;
  }
  console.log('saveLastPath', path);

  localStorage.setItem(LOCAL_STORAGE_LAST_PATH, path);
};

const getLastPath = () => {
  if (typeof window === 'undefined') {
    console.warn('getLastPath: not in browser');
    return;
  }

  return localStorage.getItem(LOCAL_STORAGE_LAST_PATH);
};

const clearLastPath = () => {
  if (typeof window === 'undefined') {
    console.warn('clearLastPath: not in browser');
    return;
  }

  localStorage.removeItem(LOCAL_STORAGE_LAST_PATH);
};

export const redirectToLastPathBeforeAuth = (redirect: (path: string) => void) => {
  const lastPath = getLastPath() ?? '/';
  console.log('redirectToLastPathBeforeAuth', lastPath);
  clearLastPath();
  redirect(lastPath);
};
