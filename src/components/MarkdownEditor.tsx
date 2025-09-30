import { Crepe } from "@milkdown/crepe";
import { Milkdown, useEditor } from "@milkdown/react";
import { collab, collabServiceCtx } from "@milkdown/plugin-collab";
import { Doc } from "yjs";
import { WebsocketProvider } from "y-websocket";

import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";
import { useEffect, useMemo, useState } from "react";
import { useAppContext } from "@/lib/appcontext";

export const MarkdownEditor = () => {
  const [crepe, setCrepe] = useState<Crepe | null>(null);
  const [status, setStatus] = useState<"Connecting" | "Connected" | "Disconnected">("Connecting");
  const { currentDocument } = useAppContext();
  let roomId = currentDocument?.id;
  // if (!roomId) return <div>Please select or create a document.</div>;
  console.log("MarkdownEditor with roomId:", roomId);

  // Create Yjs Doc + Provider
  const doc = useMemo(() => new Doc(), [roomId]);
  const wsProvider = useMemo(() => {
    console.log("Connecting to WebSocket with room:", roomId);
    if (!roomId) {
      return;
    }
    const wsp = new WebsocketProvider(
      "wss://api.myzen.works:1234",
      roomId,
      doc
    );

    wsp.on("status", (event) => {
      console.log("[CLIENT] WS status:", event.status);
      if (event.status === "connected") setStatus("Connected");
      else setStatus("Disconnected");
    });

    return wsp;
  }, [roomId, doc]);

  // Attach a debug observer to the Y.Doc
  useEffect(() => {
    const ytext = doc.getText("content");
    const observer = (event: any) => {
      console.log("[CLIENT] Local Y.Text changed:", ytext.toString(), event);
    };
    ytext.observe(observer);

    return () => ytext.unobserve(observer);
  }, [doc]);

  // Setup Milkdown editor
  useEditor(
    (root) => {
      const editorInstance = new Crepe({
        root,
        defaultValue: "",
      });
      editorInstance.editor.use(collab);
      setCrepe(editorInstance);
      return editorInstance;
    },
    [roomId, wsProvider, doc]
  );

  // Bind collab when editor is created
  useEffect(() => {
    if (!crepe) return;
    if (!wsProvider) return;
    const userName = localStorage.getItem("userName") || "Anonymous";
    if (crepe.editor.status === "Created") {
      crepe.editor.action((ctx) => {
        const collabService = ctx.get(collabServiceCtx);
        collabService
          .bindDoc(doc) // connect Y.Doc to Milkdown
          .setAwareness(wsProvider.awareness)
          .connect();
       
      });
      wsProvider.awareness.setLocalStateField("user", {
        name: userName,
        avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=" + userName
      });

       console.log("[CLIENT] Collab service bound to shared doc");

    return () => {
      wsProvider.awareness.setLocalState({});
    };
    }
  }, [crepe, doc, wsProvider]);

  const [isEditing, setIsEditing] = useState(false);
  return (
    <div className="flex-1 flex justify-center p-4 sm:p-8 organic-bg">
      <div className="w-full max-w-4xl">
        <div 
          className={`editor-content min-h-[500px] sm:min-h-[700px] p-6 sm:p-12 rounded-xl ${
            isEditing ? 'ring-2 ring-primary/20' : ''
          }`}
        >
      {!roomId ? (
        <div className="text-center text-muted-foreground">
          Please select or create a document.
        </div>
      ) : (
        <Milkdown />
      )}
                
        {/* Collaboration cursors placeholder */}
          {/* <div className="absolute top-16 left-16 collab-cursor bg-blue-500">
            <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              Alex is editing
            </div>
          </div> */}
        </div>
        
        {/* Document stats */}
        <div className="mt-4 flex flex-col sm:flex-row sm:justify-between gap-2 text-sm text-muted-foreground">
          <span>Last saved: Just now</span>
          <span>Status: {status}</span>
          <div className="flex gap-4">
            {/* <span>Words: {content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length}</span> */}
            {/* <span className="hidden sm:inline">Characters: {content.replace(/<[^>]*>/g, '').length}</span> */}
          </div>
        </div>
      </div>
    </div>
  );
};
