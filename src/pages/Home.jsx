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

function MobileArtwork() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none [--grass:min(7cqw,4cqh)] [--ground:calc(var(--grass)*0.75)] [image-rendering:pixelated] lg:hidden">
      <Art src={sky} className="left-[4%] top-[9%] w-[min(45cqw,29cqh)]" />
      <Art src={sky} className="left-[55%] top-[23%] w-[min(23cqw,14cqh)]" />
      <Art src={vine} className="right-[3%] top-0 w-[min(8cqw,4.8cqh)]" />
      <Art src={vine} className="right-[3%] top-[min(20cqw,12.2cqh)] w-[min(8cqw,4.8cqh)]" />
      <div className="absolute right-[18%] top-[10%] flex gap-[min(2cqw,1.2cqh)]">
        {[0, 1, 2].map(index => (
          <img key={index} src={star} alt="" draggable="false" className="size-[min(6.2cqw,4.6cqh)]" />
        ))}
      </div>
      <div className="absolute left-[10%] top-[23%] flex -rotate-[14deg] gap-[min(2cqw,1.2cqh)]">
        {[0, 1, 2, 3, 4].map(index => (
          <img key={index} src={heart} alt="" draggable="false" className="h-auto w-[min(5cqw,3.6cqh)]" />
        ))}
      </div>
      <Art src={rose} className="right-[8%] top-[28%] w-[min(7cqw,4cqh)] -rotate-12" />
      <Art src={sunflower} className="left-[6%] top-[57%] w-[min(7cqw,4cqh)] rotate-[-16deg]" />

      <Art src={sun} className="right-[28%] bottom-[calc(var(--grass)+min(25cqw,15cqh))] w-[min(8cqw,5cqh)]" />
      <Art src={mountains} className="right-0 bottom-[var(--ground)] w-[min(72cqw,45cqh)] landscape:w-[min(59cqw,55cqh)]" />
      <div className="absolute inset-x-0 bottom-0 h-(--grass) bg-[url('/src/assets/decor/grass_strip.svg')] bg-[length:calc(var(--grass)*6.667)_100%] bg-repeat-x" />
      <Art src={pine} className="left-[3%] bottom-[var(--ground)] w-[min(14cqw,8cqh)]" />
      <Art src={boy} className="left-[calc(3%+min(15cqw,9cqh))] bottom-[var(--ground)] w-[min(10cqw,5.8cqh)]" />
      <Art src={girl} className="left-[calc(3%+min(26cqw,15.5cqh))] bottom-[var(--ground)] w-[min(10cqw,5.8cqh)]" />
      <Art src={grove} className="left-[calc(3%+min(38cqw,22cqh))] bottom-[var(--ground)] w-[min(17cqw,10cqh)]" />
      <Art src={rock} className="left-[53%] bottom-[var(--ground)] w-[min(12cqw,7cqh)]" />
      <Art src={flower} className="left-[66%] bottom-[var(--ground)] w-[min(5cqw,3cqh)]" />
      <Art src={mushroom} className="left-[10%] bottom-[var(--ground)] w-[min(6cqw,3.6cqh)]" />
      <Art src={mushroom} className="right-[19%] bottom-[var(--ground)] w-[min(6.5cqw,4cqh)]" />
      <Art src={tree} className="right-[4%] bottom-[var(--ground)] w-[min(13cqw,8cqh)]" />
    </div>
  )
}

function Poster() {
  return (
    <section aria-labelledby="poster-title" className="@container relative isolate h-full w-full bg-brand-blue font-['Poster_Handjet'] font-bold leading-none max-lg:[container-type:size] lg:aspect-video lg:h-auto lg:overflow-hidden lg:[scale:1_min(1,calc(100dvh/56.25vw))]">
      <MobileArtwork />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden select-none [image-rendering:pixelated] lg:block">
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
      <h1 id="poster-title" aria-label="The Exchange" className="whitespace-nowrap max-lg:absolute max-lg:top-[43%] max-lg:left-1/2 max-lg:flex max-lg:w-max max-lg:-translate-1/2 max-lg:-rotate-[14deg] max-lg:flex-col max-lg:items-center">
        <span className="max-lg:-translate-x-[10cqw] lg:absolute lg:left-[29.01%] lg:top-[18.333%] lg:origin-top-left lg:rotate-[-20deg]">
          <HyperText text="THE" duration={800} animateOnLoad className="font-['Poster_Handjet'] text-[min(27cqw,17cqh)] font-bold leading-none text-brand-lime max-lg:landscape:text-[min(27cqw,21cqh)] lg:text-[23.125cqw]" />
        </span>
        <span className="lg:absolute lg:left-[13.958%] lg:top-[59.722%] lg:origin-top-left lg:rotate-[-20deg]">
          <HyperText text="EXCHANGE" duration={800} animateOnLoad className="font-['Poster_Handjet'] text-[min(27cqw,17cqh)] font-bold leading-none text-white max-lg:landscape:text-[min(27cqw,21cqh)] lg:text-[23.4375cqw]" />
        </span>
      </h1>
      <p className="absolute top-[min(59%,calc(var(--cta-y)-4rem))] right-[12%] origin-right -rotate-[14deg] whitespace-nowrap text-[min(5.5cqw,3.3cqh)] text-white lg:top-[62.3%] lg:right-auto lg:left-[16.45%] lg:origin-top-left lg:rotate-[-110deg] lg:text-[3.91cqw]">CSE DEPARTMENT</p>
    </section>
  )
}

export default function Home() {
  return (
    <div className="relative grid h-full w-full grid-rows-1 items-center max-lg:[--cta-y:min(74%,calc(100%-min(40vw,24dvh)-2.75rem))] max-lg:landscape:[--cta-y:66%] lg:h-[min(56.25vw,100dvh)]">
      <Poster />
      <Link
        to="/event-details"
        className="group absolute top-(--cta-y) right-[7%] z-50 inline-flex min-h-11 -translate-y-1/2 items-center gap-2 font-['Geologica',sans-serif] text-sm font-medium leading-tight text-brand-white text-shadow-md text-shadow-black/85 hover:text-brand-lime focus-visible:text-brand-lime focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-lime motion-safe:transition-colors sm:text-lg lg:top-[65%] lg:right-8 lg:text-xl xl:text-2xl"
      >
        See Event Details
        <span aria-hidden="true" className="motion-safe:transition-transform motion-safe:group-hover:translate-x-1">
          →
        </span>
      </Link>
    </div>
  )
}
