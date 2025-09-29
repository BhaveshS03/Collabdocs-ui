import { Header } from "@/components/Header";
import { Toolbar } from "@/components/Toolbar";
import { DocumentSidebar } from "@/components/DocumentSidebar";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import { AppContextProvider } from "@/lib/appcontext";
import { MilkdownProvider } from "@milkdown/react";

const Editor = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/";
    localStorage.removeItem("userName");
  }
  async function authenticate() {
    try {
      if (!token) {
        throw new Error("No token found");
      }
      await fetch("https://15.207.221.31:1234/api/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }).then((response) => {
        if (!response.ok) {
          throw new Error("Invalid token");
        }
        return response.json();
      }).then((data) => {
        console.log("User profile data:", data);
        localStorage.setItem("userName", data.user.name);
      }).catch((error) => {
        console.error("Error fetching profile:", error);
        window.location.href = "/";
        localStorage.removeItem("userName");
        localStorage.removeItem("token");
      });
    } 
    catch (error) {
      console.error("Error during authentication check:", error);
      window.location.href = "/";
    }
  }
  useEffect(() => {
    authenticate();
  }, [token]);

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

export default Editor;
