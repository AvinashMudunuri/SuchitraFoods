export const getCookie = (name) => {
  if (typeof window === 'undefined') return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

export const setCookie = (name, value, options = {}) => {
  if (typeof window === 'undefined') return;

  const defaultOptions = {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  };

  const opts = { ...defaultOptions, ...options };

  let cookie = `${name}=${value}`;
  cookie += `; path=${opts.path}`;
  cookie += `; max-age=${opts.maxAge}`;
  if (opts.sameSite) cookie += `; samesite=${opts.sameSite}`;
  if (opts.secure) cookie += `; secure`;

  document.cookie = cookie;
};

export const removeCookie = (name) => {
  setCookie(name, '', { maxAge: -1 });
};
