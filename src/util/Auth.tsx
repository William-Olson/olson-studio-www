export const getToken = (): string | undefined => {
  return localStorage.getItem('token') || undefined;
};

export const setToken = (token: string) => {
  localStorage.setItem('token', token);
};

export const removeToken = () => {
  localStorage.removeItem('token');
};
