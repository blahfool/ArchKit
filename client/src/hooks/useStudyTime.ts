import { useEffect, useRef } from 'react';
import { addStudyTime } from '@/lib/offlineStorage';
import { useToast } from '@/hooks/use-toast';

export function useStudyTime() {
  const startRef = useRef(Date.now());
  const { toast } = useToast();
  
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startRef.current;
      // Record time every minute
      if (elapsed >= 60000) {
        addStudyTime(elapsed)
          .catch(error => {
            console.error('Failed to record study time:', error);
            toast({
              title: "Error",
              description: "Failed to record study time",
              variant: "destructive",
            });
          });
        startRef.current = now;
      }
    }, 10000); // check every 10 seconds
    
    // Cleanup function to record final session time
    return () => {
      clearInterval(interval);
      const now = Date.now();
      const elapsed = now - startRef.current;
      if (elapsed > 0) {
        addStudyTime(elapsed).catch(console.error);
      }
    };
  }, []);
}
