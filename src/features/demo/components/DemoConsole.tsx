"use client";

import { IncidentList } from "./IncidentList";
import { VideoFeed } from "./VideoFeed";
import { XAIPanel } from "./XAIPanel";

export function DemoConsole() {
  return (
    <div className="w-full h-screen bg-dark-deep grid grid-cols-12 overflow-hidden selection:bg-terracotta/30">
      <div className="col-span-3 h-full">
        <IncidentList />
      </div>
      <div className="col-span-6 h-full">
        <VideoFeed />
      </div>
      <div className="col-span-3 h-full">
        <XAIPanel />
      </div>
    </div>
  );
}
