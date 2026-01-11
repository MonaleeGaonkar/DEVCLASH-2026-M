
export interface FaqItem {
  question: string;
  answer: string;
  link?: string;
}

export interface TrackItem {
  title: string;
  description: string;
  icon: string;
  image: string;
}

export interface ScheduleItem {
  time: string;
  event: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}
