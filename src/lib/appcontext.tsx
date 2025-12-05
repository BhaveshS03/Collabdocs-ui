import { createContext, useState, ReactNode, useContext } from "react";

export interface Document {
  id: string;
  title: string;
  lastModified: string;
  starred: boolean;
  using?: boolean;
}

interface AppContext {
  currentDocument: Document | null;
  setDocument: (doc: Document) => void;

  documents: Document[];
  setDocuments: (docs: Document[]) => void;

  user: string;
  setUser: (user: string) => void;

  loggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;

  collaborators: Array<{ id: number; name: string, email:string }>;
  setCollaborators: (
    collaborators: Array<{ id: number; name: string, email:string }>,
  ) => void;
}

export const AppContext = createContext<AppContext | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentDocument, setDocument] = useState<Document | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [user, setUser] = useState<string>("Guest");
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [collaborators, setCollaborators] = useState<
    Array<{ id: number; name: string; email: string }>
  >([]);

  return (
    <AppContext.Provider
      value={{
        documents,
        setDocuments,
        currentDocument,
        setDocument,
        user,
        setUser,
        loggedIn,
        setLoggedIn,
        collaborators,
        setCollaborators,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};
