import { useState, useEffect, useCallback } from "react";

export type FontScale = "normal" | "large" | "xlarge";

export function useAccessibility(
  onTabChange?: (tabIndex: number) => void,
  onToggleTour?: () => void,
  onCloseModal?: () => void
) {
  const [fontScale, setFontScale] = useState<FontScale>("normal");
  const [announcement, setAnnouncement] = useState<string>("");

  const announce = useCallback((message: string) => {
    setAnnouncement(message);
    // Reset announcement after 3 seconds
    setTimeout(() => {
      setAnnouncement("");
    }, 3000);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ignore shortcut keys when user is typing inside input or textarea elements
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        if (e.key === "Escape" && onCloseModal) {
          onCloseModal();
        }
        return;
      }

      // Key 1-4 for switching tabs
      if (["1", "2", "3", "4"].includes(e.key) && onTabChange) {
        e.preventDefault();
        const tabIndex = parseInt(e.key, 10);
        onTabChange(tabIndex);
        announce(`Switched to Tab ${tabIndex}`);
      }

      // Key ? for quick tour modal
      if (e.key === "?" && onToggleTour) {
        e.preventDefault();
        onToggleTour();
      }

      // Escape key for closing modals
      if (e.key === "Escape" && onCloseModal) {
        onCloseModal();
      }
    },
    [onTabChange, onToggleTour, onCloseModal, announce]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const cycleFontScale = () => {
    setFontScale((current) => {
      if (current === "normal") return "large";
      if (current === "large") return "xlarge";
      return "normal";
    });
  };

  return {
    fontScale,
    setFontScale,
    cycleFontScale,
    announcement,
    announce,
  };
}
