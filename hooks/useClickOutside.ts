"use client";

import { useEffect, useEffectEvent, type RefObject } from "react";

export default function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  onOutsideClick: () => void,
  enabled = true,
) {
  const handleOutsideClick = useEffectEvent(onOutsideClick);

  useEffect(() => {
    if (!enabled) return;

    function handleMouseDown(event: MouseEvent) {
      if (
        ref.current &&
        event.target instanceof Node &&
        !ref.current.contains(event.target)
      ) {
        handleOutsideClick();
      }
    }

    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [ref, enabled]);
}
