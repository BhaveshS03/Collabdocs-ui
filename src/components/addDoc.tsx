import { useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Upload, Share2 } from "lucide-react";
import { AlertDialog, AlertDialogTrigger, AlertDialogAction, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogDescription, AlertDialogTitle, AlertDialogCancel } from "./ui/alert-dialog";
import { useAppContext } from "@/lib/appcontext";
import axios from "axios";

export function ShareDocument() {
    const { currentDocument } = useAppContext();
    const inputRef = useRef<HTMLInputElement>(null);
    const ShareDoc = async (docId: string, emailId: string) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token found");
            }
            const response = await axios.post("/api/share-doc", { docId, emailId }, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
        return response.data;
        } catch (error) {
            console.error("Sharing document failed:", error);
            localStorage.removeItem("token");
            throw error;
        }
    };
    return (    
    <AlertDialog >
    <AlertDialogTrigger asChild>
      <Button variant="ghost" size="sm">  
          <Share2 className="w-4 h-4 mr-2"/>
          Share
        </Button>
    </AlertDialogTrigger> 
    <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle> Shared a Document</AlertDialogTitle>
          <AlertDialogDescription>
            Enter Email id and click "Share Document" to use shared document and begin collaborating instantly.
            <Input type="text" id="docId" placeholder="Email ID" className="mt-2 w-full" ref={inputRef}/>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              if (!currentDocument) {
                alert("No document is currently open to share.");
                return;
              }
              if (!inputRef.current || !inputRef.current.value.trim()) {
                alert("Please enter a valid email ID.");
                return;
              }
              const emailId = inputRef.current?.value.trim() 
              ShareDoc(currentDocument.id,  emailId).then((data) => {
                console.log("Document shared successfully:", data);
              }).catch((error) => {
                console.error("Error sharing document:", error);
                alert("Error sharing document: " + error.message);
              });
            }}
          >
            Add Document
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent> 
    </AlertDialog>
    );
}