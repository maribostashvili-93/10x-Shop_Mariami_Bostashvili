import { useEffect, useRef, useState } from "react";

/**
 * Briefly marks a button as "Added ✓" after a product is added to the cart,
 * instead of opening a confirmation dialog.
 */
export function useJustAdded(durationMs = 2000): [boolean, () => void] {
  const [justAdded, setJustAdded] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function markAdded() {
    window.clearTimeout(timer.current);
    setJustAdded(true);
    timer.current = window.setTimeout(() => setJustAdded(false), durationMs);
  }

  return [justAdded, markAdded];
}
