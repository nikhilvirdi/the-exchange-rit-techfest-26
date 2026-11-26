import { Link } from 'react-router-dom'
import { HyperText } from '../components/ui/hyper-text.jsx'
import sky from '../assets/decor/pixel_moon_mountains.svg'
import heart from '../assets/decor/red_heart.svg'
import star from '../assets/decor/golden_star.svg'
import vine from '../assets/decor/leafy_vine.svg'
import sunflower from '../assets/decor/pixel_sunflower.svg'
import rose from '../assets/decor/pixel_rose.svg'
import flower from '../assets/decor/pixel_pink_flower.svg'
import mushroom from '../assets/decor/pixel_red_mushroom.svg'
import mountains from '../assets/decor/mountains.png'
import sun from '../assets/decor/reference_sun.png'
import rock from '../assets/decor/boulder_rock.png'
import pine from '../assets/decor/pine_tree.svg'
import tree from '../assets/decor/broadleaf_tree.svg'
import boy from '../assets/decor/schoolboy.svg'
import girl from '../assets/decor/schoolgirl.svg'
import grove from '../assets/decor/trees_and_grass_combined.svg'

function Art({ src, className }) {
  return <img alt="" draggable="false" src={src} className={`absolute h-auto max-w-none ${className}`} />
}

function Poster() {
  return (
    <section aria-labelledby="poster-title" className="@container relative isolate aspect-video w-full overflow-hidden bg-brand-blue font-['Poster_Handjet'] font-bold leading-none [scale:1_min(1,calc(100dvh/56.25vw))]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none [image-rendering:pixelated]">
        <Art src={sky} className="left-[-0.833%] top-[5.463%] w-[21.354%]" />
        <Art src={rose} className="left-[5.26%] top-[44.167%] w-[5.885%] -scale-x-100" />
        <div className="absolute left-[-0.938%] top-[51.111%] w-[13.542%] aspect-[180/84] overflow-hidden ">
          <img src={sky} alt="" className="absolute right-0 top-0 w-[283.333%] max-w-none" />
        </div>
        <div className="absolute left-[21.823%] top-[41.759%] w-[10.052%] aspect-[180/84] overflow-hidden rotate-[-5deg]">
          <img src={sky} alt="" className="absolute right-0 top-0 w-[283.333%] max-w-none" />
        </div>
        {/* Heart row */}
        <Art src={heart} className="left-[23.125%] top-[15.37%] w-[3.281%] rotate-[-20deg]" />
        <Art src={heart} className="left-[26.563%] top-[13.148%] w-[3.281%] rotate-[-20deg]" />
        <Art src={heart} className="left-[30%] top-[10.926%] w-[3.281%] rotate-[-20deg]" />
        <Art src={heart} className="left-[33.438%] top-[8.704%] w-[3.281%] rotate-[-20deg]" />
        <Art src={heart} className="left-[36.875%] top-[6.481%] w-[3.281%] rotate-[-20deg]" />
        {/* Star cluster */}
        <Art src={star} className="left-[79.167%] top-[6.667%] w-[3.646%]" />
        <Art src={star} className="left-[83.021%] top-[6.759%] w-[3.646%]" />
        <Art src={star} className="left-[86.667%] top-[6.667%] w-[3.646%]" />
        {/* Hanging vine */}
        <Art src={vine} className="left-[95.104%] top-[-3.056%] w-[3.646%]" />
        <Art src={vine} className="left-[95.104%] top-[14.259%] w-[3.646%]" />
        <Art src={vine} className="left-[95.104%] top-[31.574%] w-[3.646%]" />
        {/* Floating sunflowers */}
        <Art src={sunflower} className="left-[69.323%] top-[11.296%] w-[3.542%] rotate-[-19deg]" />
        <Art src={sunflower} className="left-[79.01%] top-[61.667%] w-[2.76%] rotate-[-19deg]" />
        <Art src={mountains} className="left-[63.75%] top-[68.241%] w-[42.5%]" />
        <Art src={sun} className="left-[72.604%] top-[70.648%] w-[4.427%]" />
        <Art src={pine} className="left-[1.823%] top-[78.519%] w-[5.469%]" />
        <Art src={tree} className="left-[89.635%] top-[88.704%] w-[5.781%]" />
        <Art src={rock} className="left-[38.385%] top-[90.833%] w-[5.677%]" />
        <Art src={rock} className="left-[76.25%] top-[93.056%] w-[3.854%]" />
        <div className="absolute inset-x-0 bottom-0 h-[5.1%] bg-[url('/src/assets/decor/grass_strip.svg')] bg-[length:19cqw_100%] bg-repeat-x" />
        <div className="absolute left-[5.052%] top-[93.148%] w-[3.021%] h-[5.6%] overflow-hidden">
          <img src={grove} alt="" className="absolute bottom-0 left-0 h-[500%] max-w-none" />
        </div>
        <Art src={boy} className="left-[7.5%] top-[86.019%] w-[3.438%]" />
        <Art src={girl} className="left-[10.573%] top-[86.481%] w-[3.281%]" />
        {/* Meadow */}
        <Art src={sunflower} className="left-[0.521%] top-[90%] w-[1.667%]" />
        <Art src={sunflower} className="left-[31.25%] top-[90.741%] w-[1.719%]" />
        <Art src={sunflower} className="left-[57.448%] top-[91.574%] w-[1.771%]" />
        <Art src={rose} className="left-[49.74%] top-[83.796%] w-[5.156%]" />
        <Art src={flower} className="left-[25.885%] top-[92.87%] w-[1.563%] rotate-[62deg]" />
        {/* Mushrooms */}
        <Art src={mushroom} className="left-[14.115%] top-[93.426%] w-[2.656%]" />
        <Art src={mushroom} className="left-[44.271%] top-[93.426%] w-[2.656%]" />
      </div>
      <h1 id="poster-title" aria-label="The Exchange" className="whitespace-nowrap">
        <span className="absolute left-[29.01%] top-[18.333%] origin-top-left rotate-[-20deg]">
          <HyperText text="THE" duration={800} animateOnLoad className="font-['Poster_Handjet'] text-[23.125cqw] font-bold leading-none text-brand-lime" />
        </span>
        <span className="absolute left-[13.958%] top-[59.722%] origin-top-left rotate-[-20deg]">
          <HyperText text="EXCHANGE" duration={800} animateOnLoad className="font-['Poster_Handjet'] text-[23.4375cqw] font-bold leading-none text-white" />
        </span>
      </h1>
      <p className="absolute left-[16.45%] top-[62.3%] origin-top-left rotate-[-110deg] whitespace-nowrap text-[3.91cqw] text-white">CSE DEPARTMENT</p>
    </section>
  )
}

export default function Home() {
  return (
    <div className="relative grid h-[min(56.25vw,100dvh)] w-full grid-rows-1 items-center">
      <Poster />
      <Link
        to="/event-details"
        className="group absolute top-[75%] right-2 z-50 inline-flex min-h-11 -translate-y-1/2 items-center gap-2 font-['Geologica',sans-serif] text-xs font-medium leading-tight text-brand-white text-shadow-md text-shadow-black/85 hover:text-brand-lime focus-visible:text-brand-lime focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-lime motion-safe:transition-colors sm:top-[61%] sm:right-8 sm:text-lg lg:top-[65%] lg:text-xl xl:text-2xl"
      >
        See Event Details
        <span aria-hidden="true" className="motion-safe:transition-transform motion-safe:group-hover:translate-x-1">
          →
        </span>
      </Link>
    </div>
  )
}
