import HeroSection from '../components/home/HeroSection.jsx'
import EventTimeline from '../components/EventTimeline.jsx'
import ProblemStatementsSection from '../components/home/ProblemStatementsSection.jsx'
import JudgingSection from '../components/home/JudgingSection.jsx'
import RulesSection from '../components/home/RulesSection.jsx'
import FaqSection from '../components/home/FaqSection.jsx'
import FooterSection from '../components/home/FooterSection.jsx'
import PixelatedBackground from '../components/layout/PixelatedBackground.jsx'

export default function EventDetails() {
  return (
    <div className="relative">
      <PixelatedBackground />
      <HeroSection />
      <EventTimeline />
      <ProblemStatementsSection />
      <JudgingSection />
      <RulesSection />
      <FaqSection />
      <FooterSection />
    </div>
  )
}
