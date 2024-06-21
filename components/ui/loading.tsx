"use client"

interface LodingpageProps {
  loadingText: string;
}


export default function Loading({loadingText} : LodingpageProps) {
  return (
    <div className="w-full h-full flex flex-col space-y-3 justify-center items-center">
      <div className="text-center text-muted-foreground txt-lg">{loadingText}</div>
      <span className="flex items-center space-x-3">
      <div className='h-4 w-4 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]'></div>
	<div className='h-4 w-4 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]'></div>
	<div className='h-4 w-4 bg-primary rounded-full animate-bounce'></div>
      </span>
    </div>
  );
}
