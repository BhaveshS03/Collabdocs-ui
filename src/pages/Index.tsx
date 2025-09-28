import { Header } from "@/components/Header";
import { Toolbar } from "@/components/Toolbar";
import { DocumentSidebar } from "@/components/DocumentSidebar";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { AppContextProvider } from "@/lib/appcontext";
import { MilkdownProvider } from "@milkdown/react";

const Index = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
        <MilkdownProvider>
      <AppContextProvider>
    <div className="h-screen flex flex-col bg-background">
      <Header 
        onMenuClick={() => setSidebarOpen(true)}
        showMenuButton={isMobile}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {!isMobile && <DocumentSidebar />}
        
        <div className="flex-1 flex flex-col">
          {/* <Toolbar /> */}
          <MarkdownEditor />
        </div>
      </div>

      {/* Mobile sidebar */}
      {isMobile && (
        <DocumentSidebar 
          mobile={true}
          open={sidebarOpen}
          onOpenChange={setSidebarOpen}
        />
      )}
    </div>
    </AppContextProvider>
    </MilkdownProvider>
    
  );
};

export default Index;
