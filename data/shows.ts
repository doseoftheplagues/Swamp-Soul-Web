export interface Gig {
  date: string
  location?: string
  performers: string
  posters: Poster[]
}

export interface Poster {
  image: string
  designer: string
}

export const gigsData: Gig[] = [
  {
    date: 'October 19th 2024',
    location: 'Secret Location',
    performers:
      'Elizabeth Sanctuary (welding school for Girls), Cook ie Cutt er, Jed Hayes, Scramble204, Angel Food',
    posters: [
      { image: 'plastic-double-1.png', designer: 'Cassie Tenebaum' },
      { image: 'plastic-double-2.png', designer: 'Cassie Tenebaum' },
      {
        image: 'plastic-double-3.jpg',
        designer: 'Sofia Mary Wednesday Tarn',
      },
      { image: 'plastic-double-4.png', designer: 'Cassie Tenebaum' },
    ],
  },
  {
    date: 'June 1st 2025',
    location: "Someone's flat",
    performers: 'Co-tar, Carries Fish, Cook ie Cutt er, True Mets',
    posters: [
      {
        image: 'lezfest.png',
        designer: 'Cassie Tenebaum, Sofia Mary Wednesday Tarn',
      },
    ],
  },
  {
    date: 'July 10th 2025',
    location: 'Valhalla',
    performers:
      'Silicon Tongue, Wallflower, Spiral, A.G Studio, Cleo Mace, Elizabeth Sanctuary (welding school for Girls)',
    posters: [
      { image: 'valhallaJuly10th.jpg', designer: 'Sofia Mary Wednesday Tarn' },
      { image: 'airplaneposter.jpg', designer: 'Frankass Frudd' },
    ],
  },
]
