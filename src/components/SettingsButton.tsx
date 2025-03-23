import React, { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

function SettingsButton() {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const exportLocalStorage = () => {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        data[key] = localStorage.getItem(key);
      }
    }
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "localStorage.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importLocalStorage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          try {
            const json = JSON.parse(e.target?.result as string);
            localStorage.clear();
            for (const key in json) {
              if (Object.hasOwn(json, key)) {
                localStorage.setItem(key, json[key]);
              }
            }
            window.location.reload();
          } catch (error) {
            alert("Failed to import localStorage: " + error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <TooltipProvider>
      <div className="fixed bottom-4 right-4">
        <Tooltip open={open}>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="h-8 w-8 p-0 rounded-full"
              onClick={handleClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 7.34L16.66 4.6A2 2 0 0 0 13.73 3.7L11 5.5" />
                <path d="M20.7 13a7 7 0 0 0-4.7-4.7L18.3 5.6" />
                <path d="M13 20.7a7 7 0 0 0-4.7-4.7L5.6 18.3" />
                <path d="M4.6 7.34L7.34 4.6A2 2 0 0 0 8.27 3.7L11 5.5" />
                <path d="M3.3 11a7 7 0 0 0 4.7 4.7L5.7 18.4" />
              </svg>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="w-max">
            <div className="flex flex-col space-y-2">
              <Button variant="ghost" onClick={exportLocalStorage}>
                Export JSON Data
              </Button>
              <Button variant="ghost" onClick={importLocalStorage}>
                Import JSON Data
              </Button>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

export default SettingsButton;
