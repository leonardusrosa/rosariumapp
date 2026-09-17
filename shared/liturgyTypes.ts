export interface LiturgyItem {
  id: string;
  title: string;
  subtitle?: string;
  reference?: string;
  latin: string;
  portuguese: string;
  audioUrl?: string;
}

export type VestmentColor = 'green' | 'red' | 'white' | 'violet' | 'black';

export interface DailyLiturgyData {
  date: string; // YYYY-MM-DD
  title: string;
  liturgicalClass?: string;
  vestmentColor: VestmentColor;
  colorLabel: string;
  commentary?: string;
  missalPages?: string;
  massTime?: string;
  sourceUrl?: string;
  sections: LiturgyItem[];
}
