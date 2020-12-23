import * as application from 'application';
import {FontIcon, fonticon} from '@nativescript-community/fonticon';

FontIcon.debug = true;
FontIcon.paths = {
  'fa': 'font-awesome.css',
  'ion': 'ionicons.css'
};
FontIcon.loadCss();

application.setResources({fonticon});
application.start({ moduleName: 'main-page' });
