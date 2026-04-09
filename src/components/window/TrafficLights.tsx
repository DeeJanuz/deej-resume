"use client";

interface TrafficLightsProps {
  onClose: () => void;
  onMinimize: () => void;
  onFullScreen: () => void;
}

export function TrafficLights({ onClose, onMinimize, onFullScreen }: TrafficLightsProps) {
  return (
    <div className="flex items-center gap-[6px]">
      <button
        type="button"
        aria-label="Close window"
        onClick={onClose}
        className="h-3 w-3 rounded-full bg-[#ff5f57] shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] transition-transform hover:scale-110"
      />
      <button
        type="button"
        aria-label="Minimize window"
        onClick={onMinimize}
        className="h-3 w-3 rounded-full bg-[#febc2e] shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] transition-transform hover:scale-110"
      />
      <button
        type="button"
        aria-label="Toggle full screen"
        onClick={onFullScreen}
        className="h-3 w-3 rounded-full bg-[#28c840] shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] transition-transform hover:scale-110"
      />
    </div>
  );
}
