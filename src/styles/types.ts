/** Type of size */
export type SizeXSmall = 'xs';
export type SizeSmall = 'sm';
export type SizeMedium = 'md';
export type SizeLarge = 'lg';

export type SizeLevel = SizeXSmall | SizeSmall | SizeMedium | SizeLarge;

export interface SizeMap<T> {
  xs: T;
  sm: T;
  md: T;
  lg: T;
}

export type Primary = 'Primary';
export type Secondary = 'Secondary';
export type Success = 'Success';
export type Danger = 'Danger';
export type Warning = 'Warning';
export type Info = 'Info';
export type Light = 'Light';
export type Dark = 'Dark';

export type FontWeight =
  | '600'
  | '900'
  | '700'
  | 'normal'
  | 'bold'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '800'
  | undefined;
