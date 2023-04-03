export enum IconTypes {
  Approved = 'approved',
  Moon = 'moon',
  Sun = 'sun',
  Plus = 'plus',
  Chart = 'chart',
  Github = 'github',
  Home = 'home',
  Checkmark = 'checkmark',
  ChevronLeft = 'chevron-left',
  ChevronRight = 'chevron-right',
  RectangleGroup = 'rectangle-group',
  Star = 'star',
  UserCircle = 'user-circle'
}

export enum LogoTypes {
  Will = 'will',
  Zina = 'zina',
  Jana = 'jana',
  Studio = 'studio'
}

export enum DarkModeTypes {
  ON = 'on',
  OFF = 'off',
  SYSTEM = 'system'
}

export interface TokenData {
  sub: string;
}
