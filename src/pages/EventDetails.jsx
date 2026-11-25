import HeroSection from '../components/home/HeroSection.jsx'
import EventTimeline from '../components/EventTimeline.jsx'
import ProblemStatementsSection from '../components/home/ProblemStatementsSection.jsx'
import JudgingSection from '../components/home/JudgingSection.jsx'
import RulesSection from '../components/home/RulesSection.jsx'
import PrizesSection from '../components/home/PrizesSection.jsx'
import FaqSection from '../components/home/FaqSection.jsx'
import FooterSection from '../components/home/FooterSection.jsx'

export default function EventDetails() {
  return (
    <div>
      <HeroSection />
      <EventTimeline />
      <ProblemStatementsSection />
      <JudgingSection />
      <RulesSection />
      <PrizesSection />
      <FaqSection />
      <FooterSection />
    </div>
  )
}
