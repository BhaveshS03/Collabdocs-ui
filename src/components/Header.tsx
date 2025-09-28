import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Share2, Download, Settings, Menu } from "lucide-react";
import TitleInput from "./titleip";
import { useAppContext } from "@/lib/appcontext";
interface HeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}


export function Header({ onMenuClick, showMenuButton }: HeaderProps) {
const { currentDocument:doc } = useAppContext();
  return (
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
          <span className="font-semibold text-foreground hidden sm:block">DocsEditor</span>
        </div>
        
        <div className="h-6 w-px bg-border mx-2 hidden sm:block" />
        
        <input
          type="text"
          defaultValue="Untitled Document"
          className="text-base sm:text-lg font-medium bg-transparent border-none outline-none focus:bg-accent rounded px-2 py-1 min-w-0 flex-1 max-w-[150px] sm:max-w-xs"
        />
        <TitleInput doc={doc} />
      </div>

      {/* Right: Actions and user */}
      <div className="flex items-center gap-1 sm:gap-3">
        <Button variant="ghost" size="sm" className="hidden md:flex">
          <Download className="w-4 h-4 mr-2" />
          <span className="hidden lg:inline">Export</span>
        </Button>
        
        <Button variant="ghost" size="sm" className="hidden sm:flex">
          <Share2 className="w-4 h-4 mr-2" />
          <span className="hidden lg:inline">Share</span>
        </Button>
        
        <Button variant="ghost" size="sm" className="p-2">
          <Settings className="w-4 h-4" />
        </Button>

        <div className="h-6 w-px bg-border mx-2 hidden sm:block" />

        {/* Collaboration avatars */}
        <div className="flex -space-x-2">
          <Avatar className="w-8 h-8 border-2 border-background">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">JD</AvatarFallback>
          </Avatar>
          <Avatar className="w-8 h-8 border-2 border-background hidden sm:block">
            <AvatarFallback className="bg-accent text-accent-foreground text-xs">AL</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}