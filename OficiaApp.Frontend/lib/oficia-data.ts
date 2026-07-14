export type FeedPost = {
  id: string
  proName: string
  proAvatar: string
  rubro: string
  cover: string
  description: string
  hashtags: string[]
  likes: number
  comments: number
  shares: number
}

export type Pro = {
  id: string
  name: string
  rubro: string
  avatar: string
  rating: number
  reviews: number
  location: string
  verified: boolean
}

export type JobRequest = {
  id: string
  title: string
  category: string
  zone: string
  distance: string
  urgency: 'Urgente' | 'Esta semana' | 'Flexible'
  budget: string
  postedAt: string
  applicants: number
}

export const feedPosts: FeedPost[] = [
  {
    id: 'f1',
    proName: 'Martín Rivas',
    proAvatar: '/pro-1.png',
    rubro: 'Electricista Matriculado',
    cover: '/work-electrical.png',
    description:
      'Renovamos el tablero completo de un dúplex. Seguridad ante todo ⚡',
    hashtags: ['#electricidad', '#tablero', '#seguridad'],
    likes: 1243,
    comments: 86,
    shares: 42,
  },
  {
    id: 'f2',
    proName: 'Lucía Fernández',
    proAvatar: '/pro-2.png',
    rubro: 'Plomería & Gas',
    cover: '/work-plumbing.png',
    description:
      'Instalación de grifería premium en baño principal. Cero pérdidas 💧',
    hashtags: ['#plomeria', '#griferia', '#baño'],
    likes: 982,
    comments: 54,
    shares: 30,
  },
  {
    id: 'f3',
    proName: 'Diego Sosa',
    proAvatar: '/pro-3.png',
    rubro: 'Carpintería a medida',
    cover: '/work-carpentry.png',
    description:
      'Mueble bajo mesada hecho 100% a medida en roble macizo 🪵',
    hashtags: ['#carpinteria', '#amedida', '#cocina'],
    likes: 2105,
    comments: 132,
    shares: 78,
  },
  {
    id: 'f4',
    proName: 'Pablo Núñez',
    proAvatar: '/pro-4.png',
    rubro: 'Pintura & Revestimientos',
    cover: '/work-painting.png',
    description:
      'Pared de acento en living. Terminación impecable en un día 🎨',
    hashtags: ['#pintura', '#deco', '#living'],
    likes: 764,
    comments: 41,
    shares: 19,
  },
]

export const categories = [
  'Todos',
  'Plomería',
  'Electricidad',
  'Gas',
  'Carpintería',
  'Pintura',
  'Albañilería',
  'Aire Acond.',
  'Cerrajería',
]

export const featuredPros: Pro[] = [
  {
    id: 'p1',
    name: 'Martín Rivas',
    rubro: 'Electricista',
    avatar: '/pro-1.png',
    rating: 4.9,
    reviews: 213,
    location: 'Palermo, CABA',
    verified: true,
  },
  {
    id: 'p2',
    name: 'Lucía Fernández',
    rubro: 'Plomera / Gasista',
    avatar: '/pro-2.png',
    rating: 4.8,
    reviews: 178,
    location: 'Caballito, CABA',
    verified: true,
  },
  {
    id: 'p3',
    name: 'Diego Sosa',
    rubro: 'Carpintero',
    avatar: '/pro-3.png',
    rating: 5.0,
    reviews: 96,
    location: 'Vicente López, GBA',
    verified: true,
  },
  {
    id: 'p4',
    name: 'Pablo Núñez',
    rubro: 'Pintor',
    avatar: '/pro-4.png',
    rating: 4.7,
    reviews: 142,
    location: 'Almagro, CABA',
    verified: false,
  },
]

export type ClientRequest = {
  id: string
  title: string
  category: string
  status: 'Activa' | 'En curso' | 'Completada'
  quotes: number
  createdAt: string
  budget: string
  proName?: string
  proAvatar?: string
}

export const clientProfile = {
  name: 'Sofía Herrera',
  avatar: '/pro-2.png',
  location: 'Palermo, CABA',
  memberSince: '2025',
  activeRequests: 2,
  hiredJobs: 8,
  reviewsGiven: 6,
}

export const clientRequests: ClientRequest[] = [
  {
    id: 'cr1',
    title: 'Cambio de tomas y llaves en living',
    category: 'Electricidad',
    status: 'Activa',
    quotes: 4,
    createdAt: 'hace 20 min',
    budget: '$30.000 - $50.000',
  },
  {
    id: 'cr2',
    title: 'Destapación de cañería en baño',
    category: 'Plomería',
    status: 'En curso',
    quotes: 6,
    createdAt: 'hace 2 días',
    budget: '$18.000 - $28.000',
    proName: 'Lucía Fernández',
    proAvatar: '/pro-2.png',
  },
  {
    id: 'cr3',
    title: 'Armado de mueble de TV',
    category: 'Carpintería',
    status: 'Completada',
    quotes: 9,
    createdAt: 'hace 3 semanas',
    budget: '$25.000',
    proName: 'Diego Sosa',
    proAvatar: '/pro-3.png',
  },
]

export const jobRequests: JobRequest[] = [
  {
    id: 'j1',
    title: 'Reparación de tablero eléctrico',
    category: 'Electricidad',
    zone: 'Villa Crespo',
    distance: '1.2 km',
    urgency: 'Urgente',
    budget: '$45.000 - $70.000',
    postedAt: 'hace 8 min',
    applicants: 3,
  },
  {
    id: 'j2',
    title: 'Pérdida de agua bajo mesada de cocina',
    category: 'Plomería',
    zone: 'Belgrano',
    distance: '3.4 km',
    urgency: 'Esta semana',
    budget: '$20.000 - $35.000',
    postedAt: 'hace 25 min',
    applicants: 7,
  },
  {
    id: 'j3',
    title: 'Instalación de termotanque a gas',
    category: 'Gas',
    zone: 'Flores',
    distance: '5.1 km',
    urgency: 'Esta semana',
    budget: '$60.000 - $90.000',
    postedAt: 'hace 1 h',
    applicants: 2,
  },
  {
    id: 'j4',
    title: 'Placard a medida para dormitorio',
    category: 'Carpintería',
    zone: 'Núñez',
    distance: '6.8 km',
    urgency: 'Flexible',
    budget: '$150.000 - $250.000',
    postedAt: 'hace 3 h',
    applicants: 11,
  },
  {
    id: 'j5',
    title: 'Pintura de monoambiente completo',
    category: 'Pintura',
    zone: 'Recoleta',
    distance: '2.0 km',
    urgency: 'Flexible',
    budget: '$80.000 - $120.000',
    postedAt: 'hace 5 h',
    applicants: 9,
  },
]
