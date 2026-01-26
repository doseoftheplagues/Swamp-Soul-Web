import { Link } from 'react-router'

export function Footer() {
  return (
    <div className="mt-auto flex h-auto w-screen flex-row justify-center bg-[#eae8d860] p-1 text-xs md:text-sm">
      <div className="flex flex-row items-center py-5 pl-10">
        <img
          src="/assets/wizardBleb10ppi.png"
          alt="swamp soul logo"
          className="hidden h-40 sm:block"
        ></img>
        <div className="-mb-1 flex w-3/4 flex-col sm:w-fit sm:pl-5">
          <p className="mb-2">
            Swamp Soul is an artist run experimental music & art collective
            based in Te Whanganui a Tara.{' '}
          </p>

          <div className="mb-2 flex w-fit flex-col justify-between sm:flex-row sm:gap-2">
            <p>Contact:</p>
            <p>swampsoulmusic@gmail.com</p>
            <a
              className="w-fit hover:text-[#aba88c]"
              href="https://www.instagram.com/swamp_soul/"
            >
              Instagram
            </a>
            <a
              className="w-fit hover:text-[#aba88c]"
              href="https://swampsoul.bandcamp.com/"
            >
              Bandcamp
            </a>
            <a
              className="w-fit hover:text-[#aba88c]"
              href="https://www.youtube.com/@SwampSoul112"
            >
              Youtube
            </a>
          </div>
          <div className="flex w-fit gap-3">
            <Link to={'/credits'} className="mb-2 hover:text-[#aba88c]">
              Site Credits
            </Link>
            <p>© Swampsoul 2026</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// #7a7a7a0c
