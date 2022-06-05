export enum DarkModeTypes {
  ON = 'on',
  OFF = 'off',
  SYSTEM = 'system'
}

export const isDarkMode: () => boolean = (): boolean => {
  return document.documentElement.classList.contains('dark');
};

export const getDarkModeType: () => DarkModeTypes = (): DarkModeTypes => {
  if (!localStorage.theme) {
    return DarkModeTypes.SYSTEM;
  }

  return localStorage.theme === 'light' ? DarkModeTypes.OFF : DarkModeTypes.ON;
};

export const toggleDarkMode = (mode: DarkModeTypes): void => {
  switch (mode) {
    case DarkModeTypes.OFF:
      localStorage.theme = 'light';
      break;
    case DarkModeTypes.ON:
      localStorage.theme = 'dark';
      break;
    case DarkModeTypes.SYSTEM:
      localStorage.removeItem('theme');
      break;
    default:
      console.error('Unsupported mode: ' + mode);
      throw new Error('Unsupported mode: ' + mode);
  }
  loadDarkModeFromCache();
};

export const loadDarkModeFromCache = () => {
  if (
    localStorage.theme === 'dark' ||
    (!('theme' in localStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};
