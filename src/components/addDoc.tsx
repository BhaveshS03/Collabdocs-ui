import { useRef, useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const documentToShare = doc || currentDocument;

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.value = "";
      setError(null);
      setSuccess(null);
    }
  }, [open]);

  const ShareDoc = async (docId: string, emailId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      // show friendly message; do NOT remove token here (none exists)
      throw new Error("You must be signed in to share documents.");
    }

    try {
      const response = await axios.post(
        "/api/share-doc",
        { docId, emailId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return response.data;
    } catch (err: any) {
      // Use axios' error details when possible. DO NOT remove token here.
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const serverMsg =
          err.response?.data?.error ||
          err.message ||
          "Failed to share document.";

        // For 401 we show a clear message but still do NOT auto-logout.
        if (status === 401) {
          throw new Error(
            serverMsg || "Session expired — please sign in again.",
          );
        }
        throw new Error(serverMsg);
      }
      throw err;
    }
  };

  const handleShare = async () => {
    setError(null);
    setSuccess(null);

    if (!documentToShare) {
      setError("No document selected to share.");
      return;
    }
    const email = inputRef.current?.value?.trim();
    if (!email) {
      setError("Please enter collaborator's email.");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await ShareDoc(documentToShare.id, email);
      setSuccess("Document shared successfully.");
      // close dialog or keep it open according to UX choice
      onOpenChange(false);
    } catch (err: any) {
      // show user-facing message and let them retry
      setError(err?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Share “{documentToShare?.title || "Untitled"}”
          </AlertDialogTitle>
          <AlertDialogDescription>
            Enter the collaborator’s email below to share this document.
            <Input
              type="email"
              placeholder="Enter collaborator's email"
              className="mt-2 w-full"
              ref={inputRef}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleShare();
                }
              }}
            />
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
            {success && (
              <p className="mt-2 text-sm text-green-600">{success}</p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setError(null);
              onOpenChange(false);
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleShare} disabled={loading}>
            <Share2 className="w-4 h-4 mr-2" />
            {loading ? "Sharing..." : "Share Document"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
