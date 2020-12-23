import * as application from 'application';
import {TNSFontIcon, fonticon} from '@nativescript-community/fonticon';

TNSFontIcon.debug = true;
TNSFontIcon.paths = {
  'fa': 'font-awesome.css',
  'ion': 'ionicons.css'
};
TNSFontIcon.loadCss();

application.setResources({fonticon});
application.start({ moduleName: 'main-page' });
