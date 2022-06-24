import Emittery from 'emittery';
import { DarkModeTypes } from './types/AppTypes';

export interface DarkModeChangeEvent {
  isDarkMode: boolean;
  darkModeType: DarkModeTypes;
}

export const emitter =
  new Emittery<// Pass `{[eventName]: undefined | <eventArg>}` as the first type argument for events that pass data to their listeners.
  // A value of `undefined` in this map means the event listeners should expect no data, and a type other than `undefined` means the listeners will receive one argument of that type.
  {
    darkMode: DarkModeChangeEvent;
  }>();

export const signalDarkModeChange = (change: DarkModeChangeEvent) => {
  emitter.emit('darkMode', change);
};
