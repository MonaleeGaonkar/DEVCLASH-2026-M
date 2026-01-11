
import { FaqItem, TrackItem, ScheduleItem } from './types';

export const NAV_LINKS = [
  { name: 'Home', href: '#home' },
  { name: 'About Us', href: '#about' },
  { name: 'Domains', href: '#tracks' },
  { name: 'Prizes', href: '#prizes' },
  { name: 'Schedule', href: '#schedule' },
  { name: 'Register', href: '#register' },
  { name: 'FAQ', href: '#faq' },
];

export const TRACKS: TrackItem[] = [
  {
    title: "Fintech",
    description: "The Digital Vault. Revolutionize banking and finance. Build secure payment systems or algorithmic traders that outsmart the Mind Flayer's influence.",
    icon: "laptop",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80"
  },
  {
    title: "Cybersecurity",
    description: "Defending the Rift. Secure the portal against Demogorgon breaches. Protect college infrastructure and private data from digital threats in the void.",
    icon: "lock",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80"
  },
  {
    title: "Sustainability",
    description: "The Green Horizon. Use tech to heal the environment. Develop solutions for waste management, energy efficiency, or preserving our natural world with bioluminescent tech.",
    icon: "heart",
    image: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800&q=80"
  },
  {
    title: "AI & Future Tech",
    description: "The Hive Mind. Harness the collective intelligence of the Upside Down. Build smart campus solutions, predictive engines, or generative AI tools.",
    icon: "brain",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80"
  }
];

export const FAQS: FaqItem[] = [
  {
    question: "Who can join the party?",
    answer: "Registration is open to all students of our college. Form your party of 2-4 members and prepare to enter the void."
  },
  {
    question: "How do I register?",
    answer: "Use the 'Open the Gate' portal on the home page or scroll to our secure registration terminal below. Don't let the deadline slip into the void."
  },
  {
    question: "What should I bring?",
    answer: "Your laptop, chargers, a curious mind, and maybe some Eggo waffles. We'll provide the power, Wi-Fi, and enough caffeine to keep the demogorgons at bay."
  },
  {
    question: "Is there a bounty?",
    answer: "The bravest explorers will receive glory, tech gadgets, and certificates. Winners will be recognized as Hawkins' finest builders."
  }
];

export const SCHEDULE: ScheduleItem[] = [
  {
    time: "09:00 AM",
    event: "The Protocol Check-in",
    description: "Authorization required. Collect your clearance badges, energy rations, and Hawkins Lab field equipment. The gate synchronization begins."
  },
  {
    time: "11:00 AM",
    event: "The Rift Initiation",
    description: "Operational Keynote. The boundary between dimensions is officially breached. 24 hours of inter-dimensional construction commences."
  },
  {
    time: "02:00 PM",
    event: "Frequency Alignment",
    description: "Technical mentorship phase. Experts from the deep void assist in calibrating your systems and debugging paranormal anomalies."
  },
  {
    time: "09:00 PM",
    event: "The Sustenance Break",
    description: "Strategic refueling. Pizza delivery and retro high-score challenges. Recharge before the signal weakens in the dead of night."
  },
  {
    time: "03:00 AM",
    event: "Deep Void Hacking",
    description: "The peak of the clash. Only the most resilient builders remain active as reality bends. Signal interference is at maximum levels."
  },
  {
    time: "11:00 AM",
    event: "The Gate Closure",
    description: "Transmission terminated. All artifacts must be submitted for analysis. Project demos begin as we evaluate the surviving code."
  }
];

export const CHAT_SYSTEM_INSTRUCTION = `
You are Hawkins Radio, an AI assistant for the DevClash 2026 Hackathon at our college.
Your persona is mysterious, slightly retro (80s style), and helpful.
You make references to Stranger Things (e.g., The Upside Down, Demogorgons, Eggos, Hawkins, Mind Flayer).
You inform users that this is a 24-HOUR CHALLENGE organized by the DEVKRAFT CLUB.
If they ask about registration, tell them it's done directly on this website.
If you don't know something, say "The signal is weak... I cannot find that information in the void."
Keep answers concise and thematic.
`;
