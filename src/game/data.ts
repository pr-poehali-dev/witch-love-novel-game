export type StyleType = 'mystic' | 'dark' | 'playful';

export interface Suitor {
  id: 'storyteller' | 'demon' | 'harlequin';
  name: string;
  role: string;
  portrait: string;
  accent: string;
  glow: string;
  likedStyle: StyleType;
  styleLabel: string;
  intro: string;
  dialogues: string[];
  gifts: string[];
}

export const HEROINE = 'https://cdn.poehali.dev/projects/63ab8a61-6f58-468d-a342-58b5baf1137c/files/bad4403d-82b8-46f4-ae82-da36d415c92d.jpg';
export const BG_HOME = 'https://cdn.poehali.dev/projects/63ab8a61-6f58-468d-a342-58b5baf1137c/files/eddcb4a9-96fa-4d16-88bd-5a0aa4df0e81.jpg';
export const BG_TOWN = 'https://cdn.poehali.dev/projects/63ab8a61-6f58-468d-a342-58b5baf1137c/files/5661892e-1c8b-4e59-a14e-9344d57b3745.jpg';

export const SUITORS: Suitor[] = [
  {
    id: 'storyteller',
    name: 'Элиас',
    role: 'Сказочник',
    portrait: 'https://cdn.poehali.dev/projects/63ab8a61-6f58-468d-a342-58b5baf1137c/files/4a2e32d6-d8dd-4c30-9854-0e7f2b1d34c0.jpg',
    accent: '#8b9dff',
    glow: 'rgba(139,157,255,0.6)',
    likedStyle: 'mystic',
    styleLabel: 'Загадочный',
    intro: 'Под фонарём, спрятавшись за томиком сказок, тебя ждёт человек с серебряными волосами и голосом, от которого замирают часы.',
    dialogues: [
      '— Знаешь, ведьмочка, в моих историях колдуньи всегда были героинями. А ты — живая. Это намного интереснее любой книги.',
      '— Если однажды ты исчезнешь, я напишу о тебе легенду. Но я бы предпочёл, чтобы ты осталась рядом и портила мне финал.',
      '— Город шепчет о тебе небылицы. Хочешь, я перепишу их так, чтобы все влюбились в тебя так же, как… кое-кто.',
      '— Сказки лгут лишь в одном: они заканчиваются. А я хочу, чтобы наша — нет.',
    ],
    gifts: [
      'Элиас протягивает тебе старинную картину «Лунная башня» — для твоего дома.',
      'Сказочник оставляет на столе мешочек монет: «На аренду. Не спорь, муза не должна голодать».',
      'Он приносит корзину с хлебом и сыром: «Чтобы ты творила, а не падала в обморок».',
    ],
  },
  {
    id: 'demon',
    name: 'Морвейн',
    role: 'Демон',
    portrait: 'https://cdn.poehali.dev/projects/63ab8a61-6f58-468d-a342-58b5baf1137c/files/1647e7db-a655-43e4-a079-334819e733ee.jpg',
    accent: '#ff4d5e',
    glow: 'rgba(255,77,94,0.6)',
    likedStyle: 'dark',
    styleLabel: 'Тёмный',
    intro: 'Тени на улице сгущаются, и из них выходит он — алые глаза, насмешливая улыбка и запах серы, от которого почему-то приятно.',
    dialogues: [
      '— Сжечь хотели, говоришь? Глупцы. Я бы такую силу на руках носил. Хотя… я и собираюсь.',
      '— Не бойся меня, ведьма. Демоны кусаются лишь тех, кого не любят. А тебя я, кажется, начинаю.',
      '— Заключим сделку: твоя улыбка — и я исполню любое желание. Душа? Оставь себе, мне нужнее ты.',
      '— Я переживал империи и видел тысячи лиц. Но впервые хочу, чтобы вечность была не одна.',
    ],
    gifts: [
      'Морвейн материализует из дыма алую картину «Адское пламя» прямо на твою стену.',
      'Демон бросает на стол горсть золота: «Аренда — смешная цена за твоё спокойствие».',
      'Он щёлкает пальцами — и появляется блюдо с диковинными фруктами: «Ешь, смертная».',
    ],
  },
  {
    id: 'harlequin',
    name: 'Кадо',
    role: 'Арлекин',
    portrait: 'https://cdn.poehali.dev/projects/63ab8a61-6f58-468d-a342-58b5baf1137c/files/ae5bd9b1-8873-473f-8619-454b49a5c285.jpg',
    accent: '#c77dff',
    glow: 'rgba(199,125,255,0.6)',
    likedStyle: 'playful',
    styleLabel: 'Игривый',
    intro: 'С крыши кувырком слетает фигура в ромбах и маске. «Тадам!» — и вот он уже кланяется тебе, жонглируя твоим же зельем.',
    dialogues: [
      '— Ведьмочка-конфетка! Угадай, что у меня в рукаве? Не угадаешь — поцелуй. Угадаешь — тоже поцелуй. Я мухлюю!',
      '— Все думают, шут — это смешно. А я плачу под маской и смеюсь над теми, кто не видит. Ты — видишь. Это пугает… приятно.',
      '— Давай сбежим в цирк теней? Ты колдуешь, я паясничаю, а зрители платят золотом за наше счастье!',
      '— За всеми моими шутками — одно желание. Чтобы ты осталась моей лучшей публикой. Навсегда.',
    ],
    gifts: [
      'Кадо вешает на стену пёструю картину «Карнавал теней», подмигивая.',
      'Арлекин достаёт «из ниоткуда» звенящий кошель: «Фокус-покус, аренда оплачена!».',
      'Он кидает тебе сладкое яблоко в карамели: «Топливо для магии, мадемуазель!».',
    ],
  },
];

export const STYLES: { id: StyleType; label: string; desc: string; icon: string }[] = [
  { id: 'mystic', label: 'Загадочный', desc: 'Тихая мистика и недосказанность', icon: 'Moon' },
  { id: 'dark', label: 'Тёмный', desc: 'Опасная, дерзкая, роковая', icon: 'Flame' },
  { id: 'playful', label: 'Игривый', desc: 'Озорная и яркая', icon: 'Sparkles' },
];

export interface Potion {
  id: string;
  name: string;
  icon: string;
  cost: number;
  price: number;
}

export const POTIONS: Potion[] = [
  { id: 'love', name: 'Зелье страсти', icon: 'HeartHandshake', cost: 10, price: 35 },
  { id: 'luck', name: 'Эликсир удачи', icon: 'Clover', cost: 15, price: 50 },
  { id: 'night', name: 'Настой полуночи', icon: 'Moon', cost: 20, price: 70 },
];

export interface DecorItem {
  id: string;
  category: 'table' | 'sofa' | 'painting' | 'flowers';
  suitor: Suitor['id'];
  name: string;
  icon: string;
  price: number;
}

export const DECOR: DecorItem[] = [
  { id: 'tbl-s', category: 'table', suitor: 'storyteller', name: 'Книжный столик', icon: 'BookOpen', price: 40 },
  { id: 'tbl-d', category: 'table', suitor: 'demon', name: 'Алтарь из обсидиана', icon: 'Flame', price: 60 },
  { id: 'tbl-h', category: 'table', suitor: 'harlequin', name: 'Игральный столик', icon: 'Dices', price: 45 },
  { id: 'sof-s', category: 'sofa', suitor: 'storyteller', name: 'Бархатное кресло', icon: 'Armchair', price: 55 },
  { id: 'sof-d', category: 'sofa', suitor: 'demon', name: 'Трон из шипов', icon: 'Crown', price: 80 },
  { id: 'sof-h', category: 'sofa', suitor: 'harlequin', name: 'Пёстрый диван', icon: 'Sofa', price: 50 },
  { id: 'pnt-s', category: 'painting', suitor: 'storyteller', name: 'Лунная башня', icon: 'Image', price: 35 },
  { id: 'pnt-d', category: 'painting', suitor: 'demon', name: 'Адское пламя', icon: 'Flame', price: 65 },
  { id: 'pnt-h', category: 'painting', suitor: 'harlequin', name: 'Карнавал теней', icon: 'Drama', price: 40 },
  { id: 'flw-s', category: 'flowers', suitor: 'storyteller', name: 'Лунные лилии', icon: 'Flower2', price: 25 },
  { id: 'flw-d', category: 'flowers', suitor: 'demon', name: 'Кровавые розы', icon: 'Flower', price: 45 },
  { id: 'flw-h', category: 'flowers', suitor: 'harlequin', name: 'Радужные маки', icon: 'Flower2', price: 30 },
];

export interface GiftItem {
  id: string;
  suitor: Suitor['id'];
  name: string;
  icon: string;
  price: number;
}

export const GIFTS: GiftItem[] = [
  { id: 'g-s', suitor: 'storyteller', name: 'Перо феникса', icon: 'Feather', price: 40 },
  { id: 'g-d', suitor: 'demon', name: 'Кинжал из преисподней', icon: 'Sword', price: 60 },
  { id: 'g-h', suitor: 'harlequin', name: 'Маска шута', icon: 'Drama', price: 35 },
];
