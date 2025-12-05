import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import api  from "@/lib/api";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAppContext } from "@/lib/appcontext";
import { useAuth } from "@/lib/authcontext";
import { ShareDocument } from "./addDoc";
import { useEffect, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileText,
  Plus,
  Search,
  MoreVertical,
  Clock,
  Star,
  Share2,
  Trash2,
} from "lucide-react";

interface Document {
  id: string;
  title: string;
  lastModified: string;
  starred: boolean;
  owner?: string | null;
  sharedWith?: string[];
  createdAt?: string;
}

interface DocumentSidebarProps {
  mobile?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}


export function DocumentSidebar({
  mobile,
  open,
  onOpenChange,
}: DocumentSidebarProps) {
  const { documents, setDocuments, currentDocument, setDocument } =
    useAppContext();
  const { profile } = useAuth();
  const [shareOpen, setShareOpen] = useState(false);
  const handleShare = (doc: Document) => {
    setShareOpen(true);
  };
  const getSortedDocuments = () => {
    return [...documents].sort((a, b) => {
      // Sort by starred status (starred items first), then by last modified
      if (a.starred && !b.starred) return -1;
      if (!a.starred && b.starred) return 1;
      // If both have the same starred status, sort by last modified date
      return (
        new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
      );
    });
  };

  const fetchMyDocs = async () => {
    try {
      const res = await api.get("/api/my-docs");
      const data = res.data;
      // console.log(data);
      if (!data.ok) throw new Error("Failed to fetch documents");
      setDocuments(data.documents);
    } catch (err) {
      console.error("Error fetching user documents:", err);
    }
  };

  useEffect(() => {
    fetchMyDocs();
  }, []);

  const createDoc = async () => {
    try {
      const res = await api.post("/api/create-doc", {
        title: "Untitled Document",
      });
  
      const data = res.data;
      console.log("Create document response:", data);
      if (!data.ok) throw new Error("Failed to create document");
  
      const newDoc: Document = {
        id: data.roomId,
        title: data.meta.title,
        lastModified: new Date(data.meta.lastModified).toLocaleString(),
        starred: data.meta.starred,
        owner: data.meta.owner,
        sharedWith: data.meta.sharedWith || [],
      };
  
      setDocuments([...documents, newDoc]);
      setDocument(newDoc);
      console.log("Created and opened new document:", newDoc);
    } catch (err) {
      console.error("Error creating document:", err);
    }
  };
  

  const deleteDoc = async (documentId: string) => {
    try {
      const res = await api.post("/api/delete-doc", { docId: documentId });
      const data = res.data;
      console.log("Deleting a document:", data);
  
      if (!data.ok) throw new Error("Failed to delete document");
      else {
        window.location.reload();
      }
    } catch (err) {
      console.error("Error deleting document:", err);
    }
  };

  const updateDocTitle = async (
    documentId: string,
    newTitle?: string,
    starred?: boolean,
  ) => {
    try {
      const requestBody: { title?: string; starred?: boolean } = {};

      if (newTitle !== undefined) {
        requestBody.title = newTitle;
      }
      if (starred !== undefined) {
        requestBody.starred = starred;
      }
      await api.put(`/api/update-doc/${documentId}`, requestBody);
      setDocuments(
        documents.map((doc) =>
          doc.id === documentId
            ? {
                ...doc,
                ...(newTitle !== undefined && { title: newTitle }),
                ...(starred !== undefined && { starred }),
                lastModified: new Date().toLocaleString(),
              }
            : doc,
        ),
      );
    } catch (err) {
      console.error("Error updating document title:", err);
    }
  };

  const openDoc = (doc: Document) => {
    setDocument(doc);
    console.log(`Open document: ${doc.title}`);
  };

  const sidebarContent = (
    <>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-foreground">Documents</h2>
          <Button size="sm" className="h-8 w-8 p-0" onClick={createDoc}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search documents..." className="pl-9 h-9" />
        </div>
      </div>

      {/* Documents list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {getSortedDocuments().map((doc) => (
          <div key={doc.id}>
            <Card
              key={doc.id}
              className="doc-card p-3 cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => mobile && onOpenChange?.(false)}
            >
              <div
                className="flex items-start gap-3"
                onClick={() => openDoc(doc)}
              >
                <div className="mt-1">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm text-foreground truncate">
                      <input
                        defaultValue={doc.title}
                        className="bg-transparent border-none outline-none focus:ring-0 w-full truncate text-foreground placeholder:text-muted-foreground"
                        onBlur={(e) => {
                          updateDocTitle(doc.id, e.target.value, undefined);
                          fetchMyDocs();
                        }}
                      />
                    </h3>
                    <div className="flex items-center gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateDocTitle(doc.id, undefined, !doc.starred);
                          fetchMyDocs();
                        }}
                      >
                        <Star
                          className={`w-3 h-3 ${
                            doc.starred
                              ? "text-primary fill-current"
                              : "text-muted-foreground hover:text-primary"
                          }`}
                        />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="w-3 h-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(doc);
                            }}
                          >
                            <Share2 className="w-4 h-4 mr-2" />
                            Share Document
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteDoc(doc.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Footer actions */}
      <div className="p-4 border-t border-border">
        <Button
          variant="outline"
          className="w-full"
          size="sm"
          onClick={createDoc}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Document
        </Button>
      </div>
    </>
  );

  if (mobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-80 p-0">
          <div className="h-full bg-editor-sidebar flex flex-col">
            {sidebarContent}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="w-80 h-full bg-editor-sidebar border-r border-border flex flex-col">
      {sidebarContent}
    </div>
  );
}
