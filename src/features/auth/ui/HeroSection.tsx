import Image from "next/image"

export function HeroSection() {
  return (
    <div className="relative h-full w-full">
      <Image
        src="/images/auth/sign-in.jpg"
        alt="Hand with flowers representing hope and opportunity"
        fill
        className="object-cover"
        priority
      />
    </div>
  )
}
