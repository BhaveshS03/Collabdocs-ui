import { Crepe } from "@milkdown/crepe";
import { Milkdown, useEditor } from "@milkdown/react";
import { collab, collabServiceCtx } from "@milkdown/plugin-collab";
import { Doc } from "yjs";
import { WebsocketProvider } from "y-websocket";
import DebugPanel from "./DebugPanel";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";
import { useEffect, useMemo, useState } from "react";
import { useAppContext } from "@/lib/appcontext";

export const MarkdownEditor = () => {
  const isDev = import.meta.env.VITE_NODE_ENV === 'development';
  const wsUrl = isDev ? "ws://localhost:1234" : "wss://api.myzen.works";

  const [crepe, setCrepe] = useState<Crepe | null>(null);
  const [status, setStatus] = useState<
    "Connecting" | "Connected" | "Disconnected"
  >("Connecting");
  const { currentDocument, setCollaborators } = useAppContext();
  let roomId = currentDocument?.id;

  console.log("MarkdownEditor with roomId:", roomId);

  // Create Yjs Doc + Provider
  const doc = useMemo(() => new Doc(), [roomId]);
  const wsProvider = useMemo(() => {
    console.log("Connecting to WebSocket with room:", roomId);
    if (!roomId) {
      return;
    }
    const wsp = new WebsocketProvider(wsUrl, roomId, doc);

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
    [roomId, wsProvider, doc],
  );
  
  useEffect(() => {
    if (!wsProvider) return;

    const updateCollaborators = () => {
      const users = [];
      wsProvider.awareness.getStates().forEach((state, clientId) => {
        if (state.user && state.user.name) {
          users.push({
            id: clientId,
            name: state.user.name,
            email: state.user.email
          });
        }
      });
      setCollaborators(users);
    };

    // Initial update
    updateCollaborators();

    // Listen for changes
    wsProvider.awareness.on("change", updateCollaborators);

    return () => {
      wsProvider.awareness.off("change", updateCollaborators);
    };
  }, [wsProvider, setCollaborators]);

  // Bind collab when editor is created
  useEffect(() => {
    if (!crepe) return;
    if (!wsProvider) return;
    const userName = localStorage.getItem("userName") || "Anonymous";
    if (crepe.editor.status === "Created") {
      crepe.editor.action((ctx) => {
        const collabService = ctx.get(collabServiceCtx);
        collabService
          .bindDoc(doc)
          .setAwareness(wsProvider.awareness)
          .connect();
      });
      wsProvider.awareness.setLocalStateField("user", {
        name: userName,
      });

      console.log("[CLIENT] Collab service bound to shared doc");

      return () => {
        wsProvider.awareness.setLocalState({});
      };
    }
  }, [crepe, doc, wsProvider]);

  const [isEditing, setIsEditing] = useState(false);
  
  return (
    <div className="flex-1 flex gap-4 p-4 sm:p-8 organic-bg">
      {/* Main Editor Area */}
      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-4xl">
          <div
            className={`editor-content min-h-[500px] sm:min-h-[700px] p-6 sm:p-12 rounded-xl ${
              isEditing ? "ring-2 ring-primary/20" : ""
            }`}
          >
            {!roomId ? (
              <div className="text-center text-muted-foreground">
                Please select or create a document.
              </div>
            ) : (
              <Milkdown />
            )}
          </div>

          {/* Document stats */}
          <div className="mt-4 flex flex-col sm:flex-row sm:justify-between gap-2 text-sm text-muted-foreground">
            <span>Last saved: Just now</span>
            <span>Status: {status}</span>
            <div className="flex gap-4"></div>
          </div>
        </div>
      </div>

      {/* Debug Panel - Side by Side */}
      {isDev && wsProvider && (
        <div className="w-80 flex-shrink-0">
          <DebugPanel provider={wsProvider} />
        </div>
      )}
    </div>
  );
};