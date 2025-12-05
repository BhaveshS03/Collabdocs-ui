import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Share2, Download, Settings, Menu, LogOut } from "lucide-react";
import TitleInput from "./titleip";
import { useAppContext } from "@/lib/appcontext";
import { useState } from "react";
interface HeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/authcontext";
import { ShareDocument } from "./addDoc";

export function Header({ onMenuClick, showMenuButton }: HeaderProps) {
  const { currentDocument: doc, collaborators } = useAppContext();
  const [shareOpen, setShareOpen] = useState(false);
  const handleShare = () => {
    setShareOpen(true);
  };
  const { logout, user } = useAuth();
  const getInitials = (name: string) => {
    const words = name.trim().split(/\s+/);
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    } else {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
  };

  // Gruvbox-like muted warm palette (dark & light mix)
  const GRUVBOX_COLORS = [
    "#fb4934", // red
    "#fe8019", // orange
    "#fabd2f", // yellow
    "#b8bb26", // green
    "#8ec07c", // aqua
    "#83a598", // blue
    "#d3869b", // purple
    "#d65d0e", // dark orange
    "#689d6a", // soft green
    "#458588", // dark cyan
    "#cc241d", // dark red
    "#b16286", // magenta
    "#ebdbb2", // light fg
    "#928374", // gray
    "#a89984", // neutral
  ];

  
  const getColorFromString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++)
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    const color = GRUVBOX_COLORS[Math.abs(hash) % GRUVBOX_COLORS.length];

    // decide readable text color (light or dark)
    const n = parseInt(color.slice(1), 16);
    const r = (n >> 16) & 255,
      g = (n >> 8) & 255,
      b = n & 255;
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const text = lum > 100 ? "#282828" : "#ebdbb2"; // dark bg -> light text, vice versa
    return { background: color, text };
  };

  function UserBubble({ name, email }: { name: string; email: string }) {
    const { background } = getColorFromString(name);
  
    return (
      <Tooltip>
        <TooltipTrigger>
        <Avatar className="w-8 h-8 border-2 border-background">
          <AvatarFallback
            style={{ backgroundColor: background }}
            className="text-xs"
          >
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
        </TooltipTrigger>
        
      <TooltipContent>
        <p>{email}</p>
      </TooltipContent>
      </Tooltip>
    );
  }
  
  return (
    <TooltipProvider>
    <header className="h-16 border-b border-border bg-gradient-subtle px-6 flex items-center justify-between">
      {/* Left: Menu button (mobile), Logo and document title */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
        {showMenuButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="p-2"
          >
            <Menu className="w-4 h-4" />
          </Button>
        )}

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">D</span>
          </div>
          <span className="font-semibold text-foreground hidden sm:block">
            DocsEditor
          </span>
        </div>

        <div className="h-6 w-px bg-border mx-2 hidden sm:block" />

       <input
          type="text"
          defaultValue="Untitled Document"
          className="text-base sm:text-lg font-medium bg-transparent border-none outline-none focus:bg-accent rounded px-2 py-1 min-w-0 flex-1 max-w-[150px] sm:max-w-xs"
        />
        <TitleInput doc={doc} />
      </div>
      {/* Collaboration avatars */}
      <div className="flex -space-x-2">
        {collaborators.slice(0, 2).map((u) => (
          <UserBubble key={u.id} name={u.name}  email={u.email} />
        ))}
      </div>
      {/* Right: Actions and user */}
      <div className="flex items-center gap-1 sm:gap-3">
        <Button variant="ghost" size="sm" className="p-2" onClick={handleShare}>
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>

        <Button variant="ghost" size="sm" className="p-2" onClick={logout}>
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
        <div className="h-6 w-px bg-border mx-2 hidden sm:block" />
        {/* <ShareDocument open={shareOpen} onOpenChange={setShareOpen} doc={doc} /> */}
        {/* curr user */}
        <div className="flex -space-x-2">
          {user && <UserBubble name={user.name}  email={user.email} />}
        </div>
      </div>
    </header>
    </TooltipProvider>
  );
}
