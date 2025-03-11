import React, { createContext, useState, useContext, ReactNode } from 'react';
import { MediaContent } from '@/constants/Types';

interface MediaContextProps {
  mediaContents: MediaContent[];
  setMediaContents: React.Dispatch<React.SetStateAction<MediaContent[]>>;
}

const MediaContext = createContext<MediaContextProps | undefined>(undefined);

export const MediaProvider = ({ children }: { children: ReactNode }) => {
  const [mediaContents, setMediaContents] = useState<MediaContent[]>([]);

  return (
    <MediaContext.Provider value={{ mediaContents, setMediaContents }}>
      {children}
    </MediaContext.Provider>
  );
};

export const useMedia = (): MediaContextProps => {
  const context = useContext(MediaContext);

  if (context === undefined) {
    throw new Error('useMedia must be used within a MediaProvider');
  }

  return context;
};
