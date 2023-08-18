import resources from './resources';
import I18n from 'i18n-js';

const TL = I18n;

TL.translations = resources;
TL.fallbacks = true;

export default TL;
