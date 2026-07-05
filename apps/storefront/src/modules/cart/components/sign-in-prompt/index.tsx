import { Button } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  return (
    <div className="flex flex-col items-start justify-between gap-4 small:flex-row small:items-center">
      <div>
        <p className="font-semibold text-[#2d2d2d]">Already have an account?</p>
        <p className="mt-1 text-sm text-[#6b6b6b]">
          Sign in for a faster checkout experience.
        </p>
      </div>
      <LocalizedClientLink href="/account">
        <Button
          variant="secondary"
          className="h-10 rounded-md border-[#e5e5e5] px-6 text-sm font-medium"
          data-testid="sign-in-button"
        >
          Sign in
        </Button>
      </LocalizedClientLink>
    </div>
  )
}

export default SignInPrompt
