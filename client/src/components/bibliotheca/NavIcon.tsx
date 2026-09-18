import React from "react";
import {
  BookCopy,
  BookOpen,
  Bookmark,
  BookCheck,
  Heart,
  Layers,
  NotebookPen,
  Sparkles,
  LucideProps
} from "lucide-react";

interface NavIconProps extends LucideProps {
  name: string;
}

export function NavIcon({ name, className = "w-5 h-5", ...props }: NavIconProps) {
  switch (name) {
    case "BookCopy":
      return <BookCopy className={className} {...props} />;
    case "BookOpen":
      return <BookOpen className={className} {...props} />;
    case "Bookmark":
      return <Bookmark className={className} {...props} />;
    case "BookCheck":
      return <BookCheck className={className} {...props} />;
    case "Heart":
      return <Heart className={className} {...props} />;
    case "Layers":
      return <Layers className={className} {...props} />;
    case "NotebookPen":
      return <NotebookPen className={className} {...props} />;
    case "Sparkles":
      return <Sparkles className={className} {...props} />;
    default:
      return <BookCopy className={className} {...props} />;
  }
}

export default NavIcon;
