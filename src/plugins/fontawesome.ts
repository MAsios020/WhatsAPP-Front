import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
  faUser, 
  faEnvelope, 
  faLock, 
  faCheck, 
  faEye, 
  faEyeSlash,
  faMobileScreen, 
  faBullhorn,
  faPaperPlane,
  faUserGroup,
  faRotate,
  faArrowRotateRight,
  faChevronRight,
  faClockRotateLeft,
  faCircleCheck,
  faCircleXmark,
  faCircleExclamation,
  faChartLine,
  faChartPie,
  faEarthAmericas,
  faBars,
  faMagnifyingGlass,
  faRightFromBracket,
  faGear,
  faSun,
  faMoon,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons'

import { faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons'

// Add all icons to the library
library.add(
  faUser, 
  faEnvelope, 
  faLock, 
  faCheck, 
  faEye, 
  faEyeSlash,
  faMobileScreen, 
  faBullhorn,
  faPaperPlane,
  faUserGroup,
  faRotate,
  faArrowRotateRight,
  faChevronRight,
  faClockRotateLeft,
  faCircleCheck,
  faCircleXmark,
  faCircleExclamation,
  faChartLine,
  faChartPie,
  faEarthAmericas,
  faBars,
  faMagnifyingGlass,
  faRightFromBracket,
  faGear,
  faSun,
  faMoon,
  faArrowRight,
  faGoogle,
  faFacebook
)

// Create an icon mapping from old icon names to new ones
export const iconMapping = {
  'mobile-alt': 'mobile-screen',
  'mobile': 'mobile-screen',
  'users': 'user-group',
  'sync': 'rotate',
  'sync-alt': 'arrow-rotate-right',
  'history': 'clock-rotate-left',
  'check-circle': 'circle-check',
  'times-circle': 'circle-xmark',
  'exclamation-circle': 'circle-exclamation',
  'globe': 'earth-americas',
  'search': 'magnifying-glass',
  'sign-out-alt': 'right-from-bracket',
  'cog': 'gear'
}

export { FontAwesomeIcon }
export default FontAwesomeIcon 