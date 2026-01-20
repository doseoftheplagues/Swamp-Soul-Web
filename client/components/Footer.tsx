export function Footer() {
  return (
    <div className="relative bottom-0 mt-auto flex h-auto w-screen flex-row justify-center bg-[#7a7a7a0c] p-1 text-xs md:text-sm">
      <div className="flex flex-row items-center py-5 pl-10">
        <img
          src="/assets/wizardBleb10ppi.png"
          alt="swamp soul logo"
          className="hidden h-40 sm:block"
        ></img>
        <div className="0 -mb-1 flex flex-col pl-10">
          <p className="mb-2">
            Swamp Soul is an artist run experimental music & art collective
            based in Te Whanganui a Tara.{' '}
          </p>
          <div className="mb-2 flex flex-col">
            <p>Contact: swampsoulmusic@gmail.com</p>

            <a
              className="w-fit hover:text-[#aba88c]"
              href="https://www.instagram.com/swamp_soul/"
            >
              Instagram
            </a>
          </div>
          <p>© Swampsoul 2026</p>
        </div>
      </div>
    </div>
  )
}
