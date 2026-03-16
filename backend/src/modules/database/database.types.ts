export interface PageContent {
  type: 'Page';
  title: string;
  content: string;
}

export interface FlashcardItem {
  sentence: string;
  answer: string;
}

export interface FlashcardContent {
  type: 'Flashcard';
  cards: FlashcardItem[];
}

export interface QuizAlternative {
  id: number;
  text: string;
}

export interface QuizItem {
  question: string;
  alternatives: QuizAlternative[];
  correctAnswerId: number;
}

export interface QuizContent {
  type: 'Quiz';
  questions: QuizItem[];
}

export interface EssayItem {
  question: string;
  expectedAnswer: string;
}

export interface EssayContent {
  type: 'Essay';
  questions: EssayItem[];
}

export type SectionContent = PageContent | FlashcardContent | QuizContent | EssayContent;

export interface TrackSectionRecord {
  id: number;
  title: string;
  content: SectionContent;
}

export interface TrackRecord {
  id: string;
  title: string;
  description: string;
  authorId: string;
  createdAt: string;
  sections: TrackSectionRecord[];
}

export interface UserFollowerRecord {
  userIdentity: string;
  timestamp: string;
}

export interface UserTrackProgressRecord {
  id: string;
  progress: number;
}

export interface UserRecord {
  identity: string;
  picture: string | null;
  nickname: string;
  username: string;
  about: string | null;
  role: string | null;
  followers: UserFollowerRecord[];
  following: string[];
  certificates: string[];
  createdTracks: string[];
  inProgressTracks: UserTrackProgressRecord[];
  completedTracks: string[];
}

export interface ChatInteractionRecord {
  user: string;
  model: string;
  createdAt: string;
}

export interface ChatRecord {
  id: string;
  interactions: ChatInteractionRecord[];
  createdAt: string;
}

export interface CertificateRecord {
  id: string;
  owner: string;
  trackName: string;
  timeSpentHours: number;
  svg: string;
  createdAt: string;
}

export interface DatabaseState {
  users: UserRecord[];
  tracks: TrackRecord[];
  chats: ChatRecord[];
  certificates: CertificateRecord[];
}
