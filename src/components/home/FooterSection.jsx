import ritLogo from '../../../RITLogo.png'
import ieeeRitLogo from '../../../IEEERIT.png'
import iicLogo from '../../../IIC.png'
import sdgLogo from '../../../SDGS.png'

export default function FooterSection() {
  return (
    <section id="footer" aria-labelledby="footer-heading" className="w-full">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <h2 id="footer-heading" className="text-2xl font-bold tracking-wider text-brand-lime uppercase sm:text-3xl md:text-4xl">
          Brought to you by
        </h2>
        <ul role="list" className="mt-8 grid grid-cols-6 items-center gap-x-4 gap-y-7 md:grid-cols-5 lg:gap-x-8">
          <li className="col-span-3 md:col-span-1">
            <div className="relative mx-auto w-full max-w-52">
              {/* Split the image in the transparent gap between the emblem and wordmark. */}
              <img src={ritLogo} alt="Ramaiah Institute of Technology" width={1009} height={314} className="h-auto w-full [clip-path:inset(0_73%_0_0)]" />
              <img src={ritLogo} alt="" className="absolute inset-0 h-full w-full brightness-0 invert [clip-path:inset(0_0_0_27%)]" />
            </div>
          </li>
          <li className="col-span-3 md:col-span-1">
            <p className="mx-auto max-w-48 text-center font-['Geist',sans-serif] text-sm leading-snug font-semibold text-balance text-brand-white sm:text-base">
              Department of Computer Science and Engineering
            </p>
          </li>
          <li className="col-span-2 md:col-span-1">
            <img src={ieeeRitLogo} alt="IEEE RIT" width={1254} height={1254} className="mx-auto h-auto w-full max-w-25" />
          </li>
          <li className="col-span-2 md:col-span-1">
            <img src={iicLogo} alt="IIC" width={1024} height={443} className="mx-auto h-auto w-full max-w-44" />
          </li>
          <li className="col-span-2 md:col-span-1">
            <img src={sdgLogo} alt="SDG" width={512} height={512} className="mx-auto h-auto w-full max-w-19" />
          </li>
        </ul>
      </div>
    </section>
  )
}
