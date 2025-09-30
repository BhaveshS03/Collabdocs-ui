import { useState, useEffect } from "react";

export default function TitleInput({ doc }) {
  const [title, setTitle] = useState(doc?.title);
    useEffect(() => {
        if (!doc) return;
        const controller = new AbortController();

        const timeout = setTimeout(() => {
        fetch("http://3.111.55.107/api/update-doc", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ roomId: doc.id, title }),
            signal: controller.signal
        }).catch((err) => {
            if (err.name !== "AbortError") console.error(err);
        });
        }, 500); // debounce 500ms

        return () => {
        clearTimeout(timeout);
        controller.abort(); // cancel previous request if value changes
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
