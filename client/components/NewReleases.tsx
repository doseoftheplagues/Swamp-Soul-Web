export default function NewReleases() {
  return (
    <div className="min-h-[calc(100vh-6rem)] w-screen">
      <div className="mt-15 flex items-center justify-center px-10">
        <div className="flex w-fit flex-col md:flex-row">
          <div className="coverDiv flex w-full justify-center md:w-fit md:justify-end">
            <img
              className="h-auto w-[90vw] object-contain sm:h-140 sm:w-auto lg:h-160"
              src="https://f4.bcbits.com/img/a0671608482_16.jpg"
              alt="album cover"
            ></img>
          </div>
          <div className="otherDiv flex w-[90vw] items-center md:h-160 md:w-fit">
            <div className="flex h-fit w-[90vw] flex-col text-justify md:w-auto md:justify-start">
              <div>
                <p className="text-[clamp(2rem,5vw,6rem)] md:text-7xl">
                  Baby&apos;s coming down{' '}
                </p>
                <div className="flex w-full flex-row justify-between md:my-2 md:ml-1">
                  <p className="mb-2 text-sm md:text-3xl"> Mudgoose</p>
                  <p className="text-sm md:text-3xl">5/2/2026</p>
                </div>
                <div className="flex flex-row justify-between md:my-2 md:ml-1.5 md:max-w-186">
                  <p className="mb-2 text-sm md:text-lg">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum
                  </p>
                </div>
              </div>
              <div className="md:mt-4 md:w-140 md:place-self-center">
                <iframe
                  title="album"
                  height={'42px'}
                  width={'100%'}
                  src="https://bandcamp.com/EmbeddedPlayer/album=1174266711/size=small/bgcol=ffffff/linkcol=63b2cc/artwork=none/transparent=true/"
                  seamless
                >
                  <a href="https://mudgoose.bandcamp.com/album/chasing-horse">
                    Chasing Horse by Mudgoose
                  </a>
                </iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
