export interface ProfileTag {
  icon: 'microphone' | 'location' | 'instrument' | 'genre';
  labels: string[];
}

export interface ProfileType {
  id: string;
  initials: string;
  memberSince: number;
  name: string;
  performancesCount: number;
  picks: number;
  rehearsalsCount: number;
  tags: ProfileTag[];
  tracksCount: number;
}
