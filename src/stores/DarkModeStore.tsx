import { action, observable, makeObservable } from 'mobx';
import { signalDarkModeChange } from '../Events';
import { DarkModeTypes } from '../types/AppTypes';

class DarkModeStore {
  constructor() {
    makeObservable(this, {
      isDark: observable,
      darkModeType: observable,
      toggleDarkMode: action,
      loadDarkModeFromCache: action
    });
  }

  public isDark = false;
  public darkModeType: DarkModeTypes = DarkModeTypes.SYSTEM;

  public toggleDarkMode(mode: DarkModeTypes): void {
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
    this.loadDarkModeFromCache();
  }

  public loadDarkModeFromCache(): void {
    let darkMode = false;
    // based on system or cache
    if (!localStorage.theme) {
      darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.darkModeType = DarkModeTypes.SYSTEM;
    } else {
      this.darkModeType =
        localStorage.theme === 'light' ? DarkModeTypes.OFF : DarkModeTypes.ON;
      darkMode = localStorage.theme === 'dark';
    }

    // adjust css class
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // trigger rerendering
    this.isDark = !!darkMode;

    // emit change event for detached watchers
    signalDarkModeChange({
      isDarkMode: !!darkMode,
      darkModeType: this.darkModeType
    });
  }
}

export const DarkModeState = new DarkModeStore();
