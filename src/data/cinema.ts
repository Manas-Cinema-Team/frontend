export type SeatCategory = 'standard' | 'premium' | 'vip'
export type Format = '2D' | '3D' | 'IMAX' | 'VIP' | '2D Atmos'

export interface Showtime {
  id: string
  date: string
  dateLabel: string
  time: string
  hall: string
  format: Format
  availableSeats: number
  totalSeats: number
  priceStandard: number
  pricePremium: number
  priceVip: number
}

export interface Movie {
  id: string
  title: string
  tagline: string
  genres: string[]
  duration: number
  ageRating: string
  year: number
  director: string
  cast: string[]
  description: string
  poster: string
  imdbRating: number
  status: 'now' | 'soon'
  isPopular: boolean
  releaseDate: string
  showtimes: Showtime[]
}

const DATES: { date: string; label: string }[] = [
  { date: '2026-04-18', label: 'Сегодня' },
  { date: '2026-04-19', label: 'Сб, 19 апр' },
  { date: '2026-04-20', label: 'Вс, 20 апр' },
  { date: '2026-04-21', label: 'Пн, 21 апр' },
  { date: '2026-04-22', label: 'Вт, 22 апр' },
]

export const availableDates = DATES

const buildShowtime = (
  id: string,
  dayIndex: number,
  time: string,
  hall: string,
  format: Format,
  availableSeats: number,
  priceStandard: number,
): Showtime => {
  const d = DATES[dayIndex]!
  const totalSeats = format === 'IMAX' ? 150 : format === '3D' ? 130 : 120
  return {
    id,
    date: d.date,
    dateLabel: d.label,
    time,
    hall,
    format,
    availableSeats,
    totalSeats,
    priceStandard,
    pricePremium: priceStandard + 150,
    priceVip: priceStandard + 300,
  }
}

export const movies: Movie[] = [
  {
    id: 'midnight-arc',
    title: 'Полуночная дуга',
    tagline: 'Большая премьера недели',
    genres: ['драма', 'триллер', 'нуар'],
    duration: 128,
    ageRating: '16+',
    year: 2026,
    director: 'Ирина Лавров',
    cast: ['Артем Коршунов', 'Мира Дэн', 'Николай Волков', 'София Лейн'],
    description:
      'История о дирижере, который возвращается в город после долгого молчания и находит старый кинотеатр, где каждый вечер идет один и тот же загадочный фильм. Медитативная камерная драма о памяти, вине и музыке, которая звучит только ночью.',
    poster:
      'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?auto=format&fit=crop&w=800&q=85',
    imdbRating: 9.1,
    status: 'now',
    isPopular: true,
    releaseDate: '2026-04-10',
    showtimes: [
      buildShowtime('s-101', 0, '11:00', 'Зал 1', 'IMAX', 48, 690),
      buildShowtime('s-102', 0, '14:30', 'Зал 2', '3D', 87, 540),
      buildShowtime('s-103', 0, '17:00', 'Зал 1', 'IMAX', 12, 720),
      buildShowtime('s-104', 0, '20:00', 'Зал 3', '2D', 110, 460),
      buildShowtime('s-105', 1, '13:00', 'Зал 1', '3D', 100, 540),
      buildShowtime('s-106', 1, '19:30', 'Зал 2', 'IMAX', 65, 690),
    ],
  },
  {
    id: 'golden-station',
    title: 'Золотой вокзал',
    tagline: 'Атмосферное приключение',
    genres: ['приключения', 'мистика'],
    duration: 114,
    ageRating: '12+',
    year: 2026,
    director: 'Андрей Сомов',
    cast: ['Елена Кросс', 'Демьян Рид', 'Пётр Ясин', 'Лина Мор'],
    description:
      'Ночной поезд прибывает на платформу, которой нет на карте. Пять пассажиров получают шанс изменить одну сцену из своего прошлого — но у каждой остановки своя цена.',
    poster:
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=85',
    imdbRating: 8.7,
    status: 'now',
    isPopular: true,
    releaseDate: '2026-03-28',
    showtimes: [
      buildShowtime('s-201', 0, '12:00', 'Зал 2', '2D', 78, 460),
      buildShowtime('s-202', 0, '15:30', 'Зал 3', '3D', 40, 540),
      buildShowtime('s-203', 0, '18:00', 'Зал 1', '2D', 95, 460),
      buildShowtime('s-204', 0, '21:00', 'Зал 2', '3D', 55, 540),
      buildShowtime('s-205', 1, '17:30', 'Зал 1', '3D', 62, 540),
    ],
  },
  {
    id: 'velvet-sky',
    title: 'Бархатное небо',
    tagline: 'Романтика большого экрана',
    genres: ['мелодрама', 'музыка'],
    duration: 121,
    ageRating: '12+',
    year: 2026,
    director: 'Амара Нвеке',
    cast: ['Изабель Восс', 'Леон Моро', 'Марко Ди Лука', 'Зара Куин'],
    description:
      'Пианистка и оператор встречаются на ночной съемке, где город становится декорацией для фильма, который еще никто не написал. Тёплая, обаятельная и глубокая история о случайных связях.',
    poster:
      'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=85',
    imdbRating: 8.0,
    status: 'now',
    isPopular: false,
    releaseDate: '2026-04-04',
    showtimes: [
      buildShowtime('s-301', 0, '16:50', 'Зал 2', '2D', 68, 430),
      buildShowtime('s-302', 1, '21:40', 'Зал 4', 'VIP', 20, 780),
      buildShowtime('s-303', 2, '19:00', 'Зал 2', '2D', 88, 460),
    ],
  },
  {
    id: 'silent-orbit',
    title: 'Тихая орбита',
    tagline: 'Космическая драма',
    genres: ['фантастика', 'драма'],
    duration: 136,
    ageRating: '12+',
    year: 2026,
    director: 'Джеймс Нолан',
    cast: ['Алекс Ривера', 'Мира Чен', 'Томас Уэллс', 'София Лейн'],
    description:
      'Экипаж исследовательской станции теряет связь с Землей и обнаруживает сигнал, который звучит как старая запись из семейного архива капитана. Визуально грандиозная и эмоциональная научная фантастика.',
    poster:
      'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=85',
    imdbRating: 8.9,
    status: 'now',
    isPopular: true,
    releaseDate: '2026-03-15',
    showtimes: [
      buildShowtime('s-501', 0, '19:50', 'Зал 4', 'IMAX', 72, 720),
      buildShowtime('s-502', 0, '22:30', 'Зал 2', '3D', 85, 540),
      buildShowtime('s-503', 1, '16:00', 'Зал 1', 'IMAX', 105, 720),
    ],
  },
  {
    id: 'glass-river',
    title: 'Стеклянная река',
    tagline: 'Фильм для позднего вечера',
    genres: ['артхаус', 'драма'],
    duration: 102,
    ageRating: '16+',
    year: 2026,
    director: 'Амара Нвеке',
    cast: ['Исайя Коул', 'Прия Шарма', 'Тобиас Ланг', 'Роза Альварес'],
    description:
      'Фотограф приезжает в город у воды, где витрины отражают не улицы, а воспоминания людей, которые давно уехали. Медитативная картина о том, что остаётся после нас.',
    poster:
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=85',
    imdbRating: 8.3,
    status: 'now',
    isPopular: false,
    releaseDate: '2026-04-01',
    showtimes: [
      buildShowtime('s-601', 0, '18:10', 'Зал 5', '2D', 92, 420),
      buildShowtime('s-602', 1, '20:40', 'Зал 3', 'VIP', 18, 760),
    ],
  },
  {
    id: 'crimson-district',
    title: 'Багровый квартал',
    tagline: 'В этом городе все секреты кровоточат',
    genres: ['криминал', 'детектив', 'нуар'],
    duration: 118,
    ageRating: '18+',
    year: 2026,
    director: 'Рафаэль Нуар',
    cast: ['Маркус Хейл', 'Вивьен Кросс', 'Донато Мори', 'Селена Уорд'],
    description:
      'Выгоревший детектив втягивается в череду невозможных убийств, повторяющих преступления тридцатилетней давности. Тяжелая атмосферная нуар-история о доверии и предательстве.',
    poster:
      'https://images.unsplash.com/photo-1687812316855-006d82626bc2?auto=format&fit=crop&w=800&q=85',
    imdbRating: 7.6,
    status: 'now',
    isPopular: true,
    releaseDate: '2026-02-28',
    showtimes: [
      buildShowtime('s-701', 0, '13:30', 'Зал 2', '2D', 55, 430),
      buildShowtime('s-702', 0, '16:30', 'Зал 3', '2D', 80, 430),
      buildShowtime('s-703', 0, '21:30', 'Зал 1', '2D', 100, 430),
    ],
  },
  {
    id: 'red-lantern',
    title: 'Красный фонарь',
    tagline: 'Скоро в прокате',
    genres: ['детектив', 'криминал'],
    duration: 108,
    ageRating: '18+',
    year: 2026,
    director: 'Марина Восс',
    cast: ['Демьян Кросс', 'Елена Мор', 'Виктор Казаков', 'Джанет Хейл'],
    description:
      'Детектив получает пленку с кадрами будущего преступления и должен понять, кто управляет камерой. Напряжённый нео-нуар с неожиданными поворотами.',
    poster:
      'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=800&q=85',
    imdbRating: 7.8,
    status: 'soon',
    isPopular: false,
    releaseDate: '2026-05-14',
    showtimes: [],
  },
  {
    id: 'northern-cut',
    title: 'Северный монтаж',
    tagline: 'Скоро в прокате',
    genres: ['боевик', 'триллер'],
    duration: 125,
    ageRating: '16+',
    year: 2026,
    director: 'Виктор Крейн',
    cast: ['Рид Гаррисон', 'Хана Юки', 'Бруно Феррейра', 'Ольга Петрова'],
    description:
      'Каскадер находит смонтированную сцену аварии, которой ещё не было, и понимает, что следующий дубль может стать последним. Напряжённый постановочный триллер.',
    poster:
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=85',
    imdbRating: 7.4,
    status: 'soon',
    isPopular: false,
    releaseDate: '2026-06-06',
    showtimes: [],
  },
  {
    id: 'morning-reel',
    title: 'Утренний дубль',
    tagline: 'Семейная премьера',
    genres: ['комедия', 'семейный'],
    duration: 96,
    ageRating: '6+',
    year: 2026,
    director: 'Софи Лоран',
    cast: ['Леон Моро', 'Изабель Восс', 'Марко Ди Лука', 'Зара Куин'],
    description:
      'Юная актриса случайно меняет сценарий школьного фильма и устраивает самый тёплый съёмочный день для всего района. Лёгкая, искренняя и очень семейная история.',
    poster:
      'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=800&q=85',
    imdbRating: 7.1,
    status: 'soon',
    isPopular: false,
    releaseDate: '2026-05-28',
    showtimes: [],
  },
]

export const findMovieById = (id: string | string[]): Movie | undefined => {
  const movieId = Array.isArray(id) ? id[0] : id
  return movies.find((movie) => movie.id === movieId)
}

export const nowPlayingMovies = movies.filter((m) => m.status === 'now')
export const comingSoonMovies = movies.filter((m) => m.status === 'soon')
export const popularMovies = movies.filter((m) => m.isPopular)
export const featuredMovies = nowPlayingMovies.slice(0, 4)

export const popularShowtimes = popularMovies
  .flatMap((movie) =>
    movie.showtimes.slice(0, 2).map((showtime) => ({
      ...showtime,
      movieId: movie.id,
      movieTitle: movie.title,
      moviePoster: movie.poster,
    })),
  )
  .slice(0, 4)

export const formatDuration = (minutes: number): string => {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h} ч ${String(m).padStart(2, '0')} мин`
}

export const formatPrice = (amount: number): string => `${amount} сом`
