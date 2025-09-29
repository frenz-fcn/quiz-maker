import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';

export type AntiCheatEvent = {
  type: 'switch' | 'paste';
  timestamp: number;
};

interface AntiCheatContextValue {
  logPaste: () => void;
  getSummary: () => {
    events: AntiCheatEvent[];
  };
  setEvents: (events: AntiCheatEvent[]) => void;
}

const AntiCheatContext = createContext<AntiCheatContextValue | undefined>(
  undefined
);

export const AntiCheatProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [events, setEvents] = useState<AntiCheatEvent[]>([]);
  const blurredRef = useRef<boolean>(false);

  const logEvent = (type: 'switch' | 'paste') =>
    setEvents((prev) => [...prev, { type, timestamp: Date.now() }]);

  const logPaste = useCallback(() => logEvent('paste'), []);

  useEffect(() => {
    const handleBlur = () => {
      blurredRef.current = true;
    };
    const handleFocus = () => {
      if (blurredRef.current) {
        logEvent('switch');
        blurredRef.current = false;
      }
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const getSummary = useCallback(() => {
    return { events };
  }, [events]);

  return (
    <AntiCheatContext.Provider value={{ logPaste, getSummary, setEvents }}>
      {children}
    </AntiCheatContext.Provider>
  );
};

export const useAntiCheatContext = () => {
  const ctx = useContext(AntiCheatContext);
  if (!ctx)
    throw new Error(
      'useAntiCheatContext must be used within AntiCheatProvider'
    );
  return ctx;
};
