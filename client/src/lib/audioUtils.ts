// Audio utility functions for the Sacred Rosary application

export interface GregorianSong {
  id: string;
  title: string;
  latin: string;
  duration: string;
  description: string;
  audioPath: string;
}

export const gregorianSongs: GregorianSong[] = [
  {
    id: 'adoro-te-devote',
    title: 'Adoro Te Devote',
    latin: 'Adoro te devote, latens Deitas',
    duration: '2:33',
    description: 'Hino eucarístico de São Tomás de Aquino',
    audioPath: '/audio/adoro-te-devote-web.mp3'
  },
  {
    id: 'anima-christi',
    title: 'Anima Christi',
    latin: 'Anima Christi, sanctifica me',
    duration: '4:11',
    description: 'Oração de comunhão espiritual',
    audioPath: '/audio/anima-christi-web.mp3'
  },
  {
    id: 'benedictus',
    title: 'Benedictus',
    latin: 'Benedictus qui venit in nomine Domini',
    duration: '4:16',
    description: 'Cântico de louvor da Missa',
    audioPath: '/audio/benedictus-web.mp3'
  },
  {
    id: 'credo',
    title: 'Credo',
    latin: 'Credo in unum Deum',
    duration: '4:46',
    description: 'Profissão de fé niceno-constantinopolitana',
    audioPath: '/audio/credo-web.mp3'
  },
  {
    id: 'crucem-sanctam-subiit',
    title: 'Crucem Sanctam Subiit',
    latin: 'Crucem sanctam subiit',
    duration: '8:25',
    description: 'Antífona da Santa Cruz',
    audioPath: '/audio/crucem-sanctam-subiit-web.mp3'
  },
  {
    id: 'gloria-in-excelsis-deo',
    title: 'Gloria in Excelsis Deo',
    latin: 'Gloria in excelsis Deo',
    duration: '3:01',
    description: 'Hino de louvor angelical',
    audioPath: '/audio/gloria-in-excelsis-deo-web.mp3'
  },
  {
    id: 'magnificat',
    title: 'Magnificat',
    latin: 'Magnificat anima mea Dominum',
    duration: '4:07',
    description: 'Cântico de Nossa Senhora',
    audioPath: '/audio/magnificat-web.mp3'
  },
  {
    id: 'media-vita',
    title: 'Media Vita',
    latin: 'Media vita in morte sumus',
    duration: '2:56',
    description: 'Antífona sobre a fragilidade da vida',
    audioPath: '/audio/media-vita-web.mp3'
  },
  {
    id: 'pange-lingua',
    title: 'Pange Lingua',
    latin: 'Pange lingua gloriosi corporis mysterium',
    duration: '4:32',
    description: 'Hino eucarístico',
    audioPath: '/audio/pange-lingua-web.mp3'
  },
  {
    id: 'pater-noster',
    title: 'Pater Noster',
    latin: 'Pater noster qui es in caelis',
    duration: '1:01',
    description: 'Oração dominical ensinada por Cristo',
    audioPath: '/audio/pater-noster-optimized.mp3'
  },
  {
    id: 'regina-caeli',
    title: 'Regina Caeli',
    latin: 'Regina caeli laetare, alleluia',
    duration: '2:35',
    description: 'Antífona mariana pascal',
    audioPath: '/audio/regina-caeli-web.mp3'
  },
  {
    id: 'salve-regina',
    title: 'Salve Regina',
    latin: 'Salve Regina, Mater misericordiae',
    duration: '2:13',
    description: 'Antífona mariana medieval',
    audioPath: '/audio/salve-regina-optimized.mp3'
  },
  {
    id: 'veni-creator-spiritus',
    title: 'Veni Creator Spiritus',
    latin: 'Veni Creator Spiritus',
    duration: '3:09',
    description: 'Hino ao Espírito Santo',
    audioPath: '/audio/veni-creator-spiritus-web.mp3'
  }
];

export function getSongById(id: string): GregorianSong | undefined {
  return gregorianSongs.find(song => song.id === id);
}

export function getNextSong(currentId: string, shuffle: boolean = false): string {
  const currentIndex = gregorianSongs.findIndex(song => song.id === currentId);
  
  if (shuffle) {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * gregorianSongs.length);
    } while (randomIndex === currentIndex && gregorianSongs.length > 1);
    
    return gregorianSongs[randomIndex].id;
  }
  
  const nextIndex = (currentIndex + 1) % gregorianSongs.length;
  return gregorianSongs[nextIndex].id;
}

export function getPreviousSong(currentId: string): string {
  const currentIndex = gregorianSongs.findIndex(song => song.id === currentId);
  const prevIndex = currentIndex === 0 ? gregorianSongs.length - 1 : currentIndex - 1;
  return gregorianSongs[prevIndex].id;
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}