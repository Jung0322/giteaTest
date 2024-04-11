import Vue from 'vue';

import Cookies from 'js-cookie';

import 'normalize.css/normalize.css'; // A modern alternative to CSS resets

import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/ko';
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
// fade/zoom
import 'element-ui/lib/theme-chalk/base.css';

// import FullCalendar from 'vue-full-calendar' // full calendar
// import localeFullCalendar from 'fullcalendar/dist/locale/ko';

import '@/styles/index.scss'; // global css

import App from './App';
import router from './router';
import store from './store';

import i18n from './lang'; // Internationalization
import './icons'; // icon
import './errorLog'; // error log
import './permission'; // permission control
import './mock'; // simulation data
/** import polyfill **/
import 'babel-polyfill';
/** /import polyfill **/

/** import npm module **/
import lodash from 'lodash'; // A modern JavaScript utility library delivering modularity, performance & extras
import format from 'string-format'; // string-format is a small JavaScript library for formatting strings, based on Python's
import numeral from 'numeral';
import VeeValidate from 'vee-validate';
import moment from 'moment';
// 화면 크기에 따라 컴포넌트 표시 여부 설정:https://element.eleme.io/2.8/#/en-US/component/layout 참고
import 'element-ui/lib/theme-chalk/display.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faAngleRight,
  faAngleLeft,
  faGenderless,
  faAddressCard,
  faListAlt,
  faUserEdit,
  faCircle,
  faSearch,
  faTimes,
  faAngleDown,
  faAngleUp,
  faCaretDown,
  faCaretUp,
  faFileExcel,
  faPrint,
  faUserCircle,
  faQuestionCircle,
  faPercent,
  faTools,
  faFileAlt,
  faHardHat,
  faAlignLeft,
  faFolderOpen,
  faDesktop,
  faLaptopMedical,
  faGlobeAsia,
  faPlus,
  faHome,
  faFlask,
  faChevronUp,
  faChevronDown,
  faBuilding,
  faTruckPickup,
  faBookReader,
  faPencilAlt,
  faWonSign,
  faUndoAlt,
  faWrench,
  faSearchPlus,
  faBook,
  faExclamationTriangle,
  faPenSquare,
  faCheckSquare,
  faChartLine,
  faChartBar,
  faChartPie,
  faChartArea,
  faCalendarCheck,
  faClipboardCheck,
  faTasks,
  faWindowRestore,
  faCommentDots,
  faEyeSlash,
  faEye,
  faFireExtinguisher,
  faMobileAlt,
  faExchangeAlt,
} from '@fortawesome/free-solid-svg-icons';
import {
  FontAwesomeIcon,
  FontAwesomeLayers,
  FontAwesomeLayersText,
} from '@fortawesome/vue-fontawesome';
import 'jquery';
/** /import npm module **/

/** font awesome setting **/
library.add(faCommentDots);
library.add(faCalendarCheck);
library.add(faClipboardCheck);
library.add(faTasks);
library.add(faWindowRestore);
library.add(faChartLine);
library.add(faChartBar);
library.add(faChartPie);
library.add(faChartArea);
library.add(faAngleRight);
library.add(faAngleLeft);
library.add(faGenderless);
library.add(faAddressCard);
library.add(faListAlt);
library.add(faUserEdit);
library.add(faCircle);
library.add(faSearch);
library.add(faTimes);
library.add(faAngleDown);
library.add(faAngleUp);
library.add(faCaretDown);
library.add(faCaretUp);
library.add(faFileExcel);
library.add(faPrint);
library.add(faUserCircle);
library.add(faQuestionCircle);
library.add(faPercent);
library.add(faChevronUp);
library.add(faChevronDown);
library.add(faTools);
library.add(faFileAlt);
library.add(faHardHat);
library.add(faAlignLeft);
library.add(faFolderOpen);
library.add(faDesktop);
library.add(faLaptopMedical);
library.add(faGlobeAsia);
library.add(faPlus);
library.add(faHome);
library.add(faFlask);
library.add(faBuilding);
library.add(faTruckPickup);
library.add(faBookReader);
library.add(faPencilAlt);
library.add(faWonSign);
library.add(faUndoAlt);
library.add(faWrench);
library.add(faSearchPlus);
library.add(faBook);
library.add(faExclamationTriangle);
library.add(faPenSquare);
library.add(faCheckSquare);
library.add(faEyeSlash);
library.add(faEye);
library.add(faFireExtinguisher);
library.add(faMobileAlt);
library.add(faExchangeAlt);
/** font awesome setting **/

/** import vue bootstrap **/
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
// import 'bootstrap-xxl/dist/css/bootstrap.css'
import 'bootstrap-xxl/dist/js/bootstrap.min.js';
/** import vue bootstrap **/

import 'vue2-datepicker/index.css';
import 'vue2-datepicker/locale/ko';

// import "fullcalendar/dist/fullcalendar.min.css";

/** import js **/
import httpRequest from '@/js/http'; // Promise based HTTP client for the browser and node.js
import backendConfig from '@/js/backendConfig.js';
import comm from '@/js/common.js';
import message from '@/js/message.js';
import popupRequired from '@/js/popupRequired.js';
/** /import js **/

/** import custom vue component **/
import YText from '@/components/YText';
import YSelect from '@/components/YSelect';
import YBtn from '@/components/YBtn';
import YDatepicker from '@/components/YDatepicker';
import YRadio from '@/components/YRadio';
import YTextarea from '@/components/YTextarea';
// import YDurationpicker from '@/components/YDurationpicker';
import YMultiSelect from '@/components/YMultiSelect';
import YNumber from '@/components/YNumber';
import YCheckbox from '@/components/YCheckbox';
// import YExpandSearch from '@/components/YExpandSearch';
import YDataTable from '@/components/YDataTable';
import YSwitch from '@/components/YSwitch';
import YLabel from '@/components/YLabel';
import YSuttleBox from '@/components/YSuttleBox';
import YLoader from '@/components/YLoader';
import YPopup from '@/components/YPopup';
import YDialog from '@/components/YDialog';
import YFileUpload from '@/components/YFileUpload';
import YTreeDept from '@/components/YTreeDept';
import YTreeProcess from '@/components/YTreeProcess';
import YTag from '@/components/YTag';
import YPlant from '@/components/YPlant';
import YTreeFacilityType from '@/components/YTreeFacilityType';
// import YTreeManagementOfType from '@/components/YTreeManagementOfType';
import ImgMark from '@/components/ImgMark';
import YVueSimpleCalendar from '@/components/YVueSimpleCalendar';
import YVueSimpleCalendarMini from '@/components/YVueSimpleCalendarMini';
import YSearchBox from '@/components/YSearchBox';
import YImageViewer from '@/components/YImageViewer';
import YSignaturePad from '@/components/YSignaturePad';
import YPalette from '@/components/YPalette';
import YColorPicker from '@/components/YColorPicker';
import YTagStructure from '@/components/YTagStructure';
import YAttachColumn from '@/components/YAttachColumn';
import YQRCodeGen from '@/components/YQRCodeGen';
/** /import custom vue component **/
import RuntimeTemplateCompiler from 'vue-runtime-template-compiler';
import VueSignaturePad from 'vue-signature-pad';
import YAUIGrid from '@/components/YAUIGrid';

import VueMask from 'v-mask';
Vue.use(VueMask);
Vue.use(RuntimeTemplateCompiler);
Vue.use(VueSignaturePad);

import * as filters from './filters'; // global filters

// TODO : ElementUI 한국어 설정
Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value),
  locale,
});
Vue.component(CollapseTransition.name, CollapseTransition);

// Vue.use(FullCalendar, {
//   localeFullCalendar
// });

// register global utility filters.
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

Vue.use(VeeValidate, {
  fieldsBagName: 'veeBag',
});
Vue.use(BootstrapVue);

/** Global Custom Component **/
Vue.component('f-icon', FontAwesomeIcon);
Vue.component('f-icon-layers', FontAwesomeLayers);
Vue.component('f-icon-layers-text', FontAwesomeLayersText);
Vue.component(YText.name, YText);
Vue.component(YSelect.name, YSelect);
Vue.component(YDatepicker.name, YDatepicker);
Vue.component(YRadio.name, YRadio);
// Vue.component(YDurationpicker.name, YDurationpicker);
Vue.component(YTextarea.name, YTextarea);
Vue.component(YMultiSelect.name, YMultiSelect);
Vue.component(YNumber.name, YNumber);
Vue.component(YCheckbox.name, YCheckbox);
// Vue.component(YExpandSearch.name, YExpandSearch);
Vue.component(YDataTable.name, YDataTable);
Vue.component(YBtn.name, YBtn);
Vue.component(YSwitch.name, YSwitch);
Vue.component(YLabel.name, YLabel);
Vue.component(YSuttleBox.name, YSuttleBox);
Vue.component(YLoader.name, YLoader);
Vue.component(YPopup.name, YPopup);
Vue.component(YDialog.name, YDialog);
Vue.component(YFileUpload.name, YFileUpload);
Vue.component(YTreeDept.name, YTreeDept);
Vue.component(YTreeProcess.name, YTreeProcess);
Vue.component(YTag.name, YTag);
Vue.component(YPlant.name, YPlant);
Vue.component(YTreeFacilityType.name, YTreeFacilityType);
// Vue.component(YTreeManagementOfType.name, YTreeManagementOfType);
Vue.component(ImgMark.name, ImgMark);
Vue.component(YVueSimpleCalendar.name, YVueSimpleCalendar);
Vue.component(YVueSimpleCalendarMini.name, YVueSimpleCalendarMini);
Vue.component(YSearchBox.name, YSearchBox);
Vue.component(YImageViewer.name, YImageViewer);
Vue.component(YSignaturePad.name, YSignaturePad);
Vue.component(YPalette.name, YPalette);
Vue.component(YColorPicker.name, YColorPicker);
Vue.component(YTagStructure.name, YTagStructure);
Vue.component(YAttachColumn.name, YAttachColumn);
Vue.component(YQRCodeGen.name, YQRCodeGen);
Vue.component(YAUIGrid.name, YAUIGrid);

/** Global Custom Component **/

/** global variable in Vue app **/
Vue.prototype.$_ = lodash;
Vue.prototype.$format = format;
Vue.prototype.$numeral = numeral;
Vue.prototype.$http = httpRequest;
Vue.prototype.$backend = backendConfig;
Vue.prototype.$moment = moment;
Vue.prototype.$comm = comm;
Vue.prototype.$commMessage = message;
Vue.prototype.$cookies = Cookies;
Vue.prototype.$popupRequired = popupRequired;
/** /global variable in Vue app **/

Vue.config.productionTip = false;
// TODO: RuntimeTemplateCompiler 사용하기 위한 설정
Vue.config.devtools = false;

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  httpRequest,
  data: { loading: false }, // vue-router에서 사용
  render: (h) => h(App),
});
