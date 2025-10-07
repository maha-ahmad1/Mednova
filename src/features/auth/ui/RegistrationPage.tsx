import { HeroSection } from "./HeroSection"
import { RegistrationForm } from "./RegistrationForm"
export function RegistrationPage() {
  return (
    <div className="bg-white h-screen">
      <div className="h-full grid lg:grid-cols-2 items-stretch gap-0">

         
       
        <div className="flex flex-col items-center justify-center p-4 lg:p-8">
          <div className="w-full max-w-md lg:max-w-lg">
            <RegistrationForm />
          </div>
        </div>
        <div className="hidden lg:block">
          <HeroSection />
        </div>
      </div>
    </div>
  )
}