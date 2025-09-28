import { useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Upload, Share2 } from "lucide-react";
import { AlertDialog, AlertDialogTrigger, AlertDialogAction, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogDescription, AlertDialogTitle, AlertDialogCancel } from "./ui/alert-dialog";
import { useAppContext } from "@/lib/appcontext";

export function AddDoc() {
    const { setDocument, setDocuments, documents } = useAppContext();
    const inputRef = useRef<HTMLInputElement>(null);
    
    return (    
    <AlertDialog >
    <AlertDialogTrigger asChild>
      <Button variant="ghost" size="sm">  
          <Upload className="w-4 h-4 mr-2"/>
          Import ID
        </Button>
    </AlertDialogTrigger> 
    <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle> Use a Shared Document</AlertDialogTitle>
          <AlertDialogDescription>
            Enter collab id and click "Add Document" to use shared document and begin collaborating instantly.
            <Input type="text" id="docId" placeholder="Document ID" className="mt-2 w-full" ref={inputRef}/>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              const id = inputRef.current?.value.trim() 
              // call api get document by id
              // if document with id exists, setDocument to that document
              console.log("Importing document with id:", id);
              if (!id) {
                console.error("Document ID is required");
                return;
              }
              const newDoc = {
                id: id,
                title: "Untitled Document",
                lastModified: new Date().toLocaleString(),
                starred: false,
              };

              const exists = documents.some(doc => doc.id === newDoc.id);
              if( !exists ) {
                setDocuments([...documents, newDoc]);
              }

              setDocument(newDoc);
              console.log("Set current document to:", newDoc);
            }}
          >
            Add Document
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent> 
    </AlertDialog>
    );
}

export function ShareDoc() {
    const { currentDocument } = useAppContext();

    return (    
    <AlertDialog >
    <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
    </AlertDialogTrigger> 
    <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle> Use a Shared Document</AlertDialogTitle>
          <AlertDialogDescription>
            Share Document collab id and begin collaborating instantly.
            { currentDocument &&
              <Input type="text" id="docId" placeholder="Document ID" className="mt-2 w-full" value={currentDocument.id} readOnly/>
            }
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* <AlertDialogCancel>Cancel</AlertDialogCancel> */}
          <AlertDialogAction>
            Close
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent> 
    </AlertDialog>
    );
}