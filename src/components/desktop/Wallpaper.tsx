"use client";

export function Wallpaper() {
  return (
    <div className="fixed inset-0 overflow-hidden bg-[#1a1a2e]">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #1a1a3e 0%, #2d1b4e 30%, #4a2545 55%, #c2622d 85%, #e8a44a 100%)",
        }}
      />

      <div className="absolute -left-[10%] top-[8%] h-[28rem] w-[28rem] rounded-full bg-[rgba(60,80,180,0.55)] blur-3xl" />
      <div className="absolute left-[24%] top-[34%] h-[22rem] w-[22rem] rounded-full bg-[rgba(80,140,200,0.45)] blur-3xl" />
      <div className="absolute right-[12%] top-[10%] h-[24rem] w-[24rem] rounded-full bg-[rgba(120,80,180,0.50)] blur-3xl" />
      <div className="absolute bottom-[-8%] right-[18%] h-[22rem] w-[30rem] rounded-full bg-[rgba(200,120,60,0.40)] blur-3xl" />
      <div className="absolute bottom-[-6%] left-[4%] h-[20rem] w-[26rem] rounded-full bg-[rgba(60,160,160,0.35)] blur-3xl" />

      <div
        className="absolute inset-x-0 bottom-0 h-[20%]"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.12) 100%)",
        }}
      />
    </div>
  );
}
