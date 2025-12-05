import { Header } from "@/components/Header";
import { Toolbar } from "@/components/Toolbar";
import { DocumentSidebar } from "@/components/DocumentSidebar";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import { AppContextProvider } from "@/lib/appcontext";
import { MilkdownProvider } from "@milkdown/react";
import api from "@/lib/api";

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
  
      const res = await api.get("/api/profile");
  
      console.log("User profile data:", res.data);
      localStorage.setItem("userName", res.data.user.name);
  
    } catch (error) {
      console.error("Error fetching profile:", error);
  
      localStorage.removeItem("userName");
      localStorage.removeItem("token");
  
      window.location.href = "/";
    }
  }
  useEffect(() => {
    authenticate();
  }, [token]);

  return (
    <MilkdownProvider>
      <AppContextProvider>
        <div className="h-screen flex flex-col bg-background overflow-hidden">
          <Header
            onMenuClick={() => setSidebarOpen(true)}
            showMenuButton={isMobile}
          />

          <div className="flex flex-1 overflow-hidden">
            {!isMobile && <DocumentSidebar />}

            <div className="flex-1 flex flex-col overflow-hidden">
              {/* <Toolbar /> */}
              <div className="flex-1 overflow-y-auto">
                <MarkdownEditor />
              </div>
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
