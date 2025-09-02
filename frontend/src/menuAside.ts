import * as icon from '@mdi/js';
import { MenuAsideItem } from './interfaces'

const menuAside: MenuAsideItem[] = [
  {
    href: '/dashboard',
    icon: icon.mdiViewDashboardOutline,
    label: 'Dashboard',
  },

  {
    href: '/users/users-list',
    label: 'Users',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiAccountGroup ?? icon.mdiTable,
    permissions: 'READ_USERS'
  },
  {
    href: '/courses/courses-list',
    label: 'Courses',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiBookOpenPageVariant' in icon ? icon['mdiBookOpenPageVariant' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_COURSES'
  },
  {
    href: '/messages/messages-list',
    label: 'Messages',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiEmailOutline' in icon ? icon['mdiEmailOutline' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_MESSAGES'
  },
  {
    href: '/notes/notes-list',
    label: 'Notes',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiNoteOutline' in icon ? icon['mdiNoteOutline' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_NOTES'
  },
  {
    href: '/options/options-list',
    label: 'Options',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiCheckboxMarkedCircleOutline' in icon ? icon['mdiCheckboxMarkedCircleOutline' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_OPTIONS'
  },
  {
    href: '/questions/questions-list',
    label: 'Questions',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiHelpCircleOutline' in icon ? icon['mdiHelpCircleOutline' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_QUESTIONS'
  },
  {
    href: '/quizzes/quizzes-list',
    label: 'Quizzes',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiClipboardQuestionOutline' in icon ? icon['mdiClipboardQuestionOutline' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_QUIZZES'
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: icon.mdiAccountCircle,
  },

 {
    href: '/api-docs',
    target: '_blank',
    label: 'Swagger API',
    icon: icon.mdiFileCode,
    permissions: 'READ_API_DOCS'
  },
]

export default menuAside
