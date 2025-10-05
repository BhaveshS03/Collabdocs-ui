import { useRef, useEffect } from "react";
import { Input } from "./ui/input";
import { Share2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogCancel,
} from "./ui/alert-dialog";
import { useAppContext } from "@/lib/appcontext";
import axios from "axios";

interface ShareDocumentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doc?: { id: string; title?: string };
}

export function ShareDocument({ open, onOpenChange, doc }: ShareDocumentProps) {
  const { currentDocument } = useAppContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const documentToShare = doc || currentDocument;

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.value = "";
    }
  }, [open]);

  const ShareDoc = async (docId: string, emailId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.post(
        "/api/share-doc",
        { docId, emailId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error: any) {
      console.error("Sharing document failed:", error);
      localStorage.removeItem("token");
      throw error;
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Share “{documentToShare?.title || "Untitled"}”</AlertDialogTitle>
          <AlertDialogDescription>
            Enter the collaborator’s email below to share this document.
            <Input
              type="text"
              placeholder="Enter collaborator's email"
              className="mt-2 w-full"
              ref={inputRef}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              if (!documentToShare) return alert("No document selected to share.");
              if (!inputRef.current?.value.trim()) return alert("Please enter a valid email.");
              const emailId = inputRef.current.value.trim();

              ShareDoc(documentToShare.id, emailId)
                .then((data) => {
                  console.log("Document shared successfully:", data);
                  onOpenChange(false);
                })
                .catch((error) => {
                  console.error("Error sharing document:", error);
                  alert("Error sharing document: " + error.message);
                });
            }}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Document
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
