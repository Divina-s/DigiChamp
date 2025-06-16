import Cookies from 'js-cookie';

export const cookieSet = (key: string, value: string): void => {
  // 1 hour from now
  const inOneHour = new Date(Date.now() + 60 * 60 * 1000);

  Cookies.set(key, value, {
    expires: inOneHour,
    secure: false,   // change to true in production
    httpOnly: false, // note: js-cookie cannot set httpOnly cookies, this option is ignored
  });
};

export const cookieGet = (key: string): string | undefined => {
  return Cookies.get(key);
};

export const cookieRemove = (key: string): void => {
  Cookies.remove(key);
};
