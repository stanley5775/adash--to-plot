import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-pulse">
        <Image
          src="/images/logo.png"
          alt="Adashè-to-Plot"
          width={168}
          height={44}
          priority
          className="h-10 w-auto"
        />
      </div>
    </div>
  );
}
