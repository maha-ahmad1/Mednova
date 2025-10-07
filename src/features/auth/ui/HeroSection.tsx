import Image from "next/image"

export function HeroSection() {
  return (
    <div className="relative h-full flex flex-col items-center justify-center text-center space-y-8">
      <div className="relative w-full h-full overflow-hidden ">
        <Image
          src="/images/auth/sign-in.jpg"
          alt="Hand with flowers representing hope and opportunity"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  )
}