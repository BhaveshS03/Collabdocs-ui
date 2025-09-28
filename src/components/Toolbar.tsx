import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  List,
  ListOrdered,
  Undo,
  Redo,
  Type,
  Palette
} from "lucide-react";
import { useState } from "react";

export function Toolbar() {
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());

  const toggleFormat = (format: string) => {
    const newFormats = new Set(activeFormats);
    if (newFormats.has(format)) {
      newFormats.delete(format);
    } else {
      newFormats.add(format);
    }
    setActiveFormats(newFormats);
  };

  const isActive = (format: string) => activeFormats.has(format);

  return (
    <div className="editor-toolbar h-12 px-2 sm:px-4 flex items-center gap-1 overflow-x-auto">
      {/* History */}
      <div className="flex items-center gap-1 shrink-0">
        <Button variant="ghost" size="sm" className="btn-editor">
          <Undo className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" className="btn-editor">
          <Redo className="w-4 h-4" />
        </Button>
      </div>
      
      <Separator orientation="vertical" className="h-6 mx-1 sm:mx-2 shrink-0" />

      {/* Font formatting */}
      <div className="flex items-center gap-1 shrink-0">
        <Button 
          variant="ghost" 
          size="sm" 
          className={`btn-editor ${isActive('bold') ? 'active' : ''}`}
          onClick={() => toggleFormat('bold')}
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`btn-editor ${isActive('italic') ? 'active' : ''}`}
          onClick={() => toggleFormat('italic')}
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`btn-editor ${isActive('underline') ? 'active' : ''}`}
          onClick={() => toggleFormat('underline')}
        >
          <Underline className="w-4 h-4" />
        </Button>
      </div>
      
      <Separator orientation="vertical" className="h-6 mx-1 sm:mx-2 shrink-0 hidden sm:block" />

      {/* Text styles - more compact on mobile */}
      <div className="flex items-center gap-1 shrink-0">
        <select className="px-2 py-1 text-sm bg-background border border-border rounded focus:ring-2 focus:ring-ring min-w-[80px] sm:min-w-[120px]">
          <option>Normal</option>
          <option>Heading 1</option>
          <option>Heading 2</option>
          <option>Heading 3</option>
        </select>

        <Button variant="ghost" size="sm" className="btn-editor hidden sm:flex">
          <Type className="w-4 h-4" />
        </Button>

        <Button variant="ghost" size="sm" className="btn-editor hidden sm:flex">
          <Palette className="w-4 h-4" />
        </Button>
      </div>
      
      <Separator orientation="vertical" className="h-6 mx-1 sm:mx-2 shrink-0 hidden md:block" />

      {/* Alignment - hidden on small screens */}
      <div className="hidden md:flex items-center gap-1 shrink-0">
        <Button variant="ghost" size="sm" className="btn-editor">
          <AlignLeft className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" className="btn-editor">
          <AlignCenter className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" className="btn-editor">
          <AlignRight className="w-4 h-4" />
        </Button>
      </div>
      
      <Separator orientation="vertical" className="h-6 mx-1 sm:mx-2 shrink-0 hidden lg:block" />

      {/* Lists */}
      <div className="flex items-center gap-1 shrink-0">
        <Button variant="ghost" size="sm" className="btn-editor">
          <List className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" className="btn-editor">
          <ListOrdered className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}