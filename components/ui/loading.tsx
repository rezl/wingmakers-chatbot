"use client"

interface LodingpageProps {
  loadingText: string;
}


export default function Loading({loadingText} : LodingpageProps) {
  return (
    <div className="w-full h-full flex flex-col space-y-2 justify-center items-center">
      <div className="text-center text-muted-foreground">{loadingText}</div>
      <span className="loading loading-infinity loading-lg"></span>
    </div>
  );
}
