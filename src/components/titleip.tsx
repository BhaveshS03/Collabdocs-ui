import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function TitleInput({ doc }) {
  const [title, setTitle] = useState(doc?.title ?? "");

  useEffect(() => {
    if (!doc) return;
    const controller = new AbortController();

    const timeout = setTimeout(() => {
      api
        .post(
          "/update-doc",                    
          { roomId: doc.id, title },    
          { signal: controller.signal },
        )
        .catch((err) => {
          if (err.name !== "CanceledError" && err.name !== "AbortError") {
            console.error(err);
          }
        });
    }, 500); // debounce 500ms

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [title, doc?.id]);

  return (
    <input
      defaultValue={doc?.title}
      className="bg-transparent border-none outline-none focus:ring-0 w-full truncate text-foreground placeholder:text-muted-foreground"
      onChange={(e) => setTitle(e.target.value)}
    />
  );
}
