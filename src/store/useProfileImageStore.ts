import { create } from "zustand"

interface ProfileImageState {
  image: string | null
  setImage: (image: string) => void
  clearImage: () => void
}

/**
 * useProfileImageStore manages the profile image state globally using Zustand.
 * This is the source of truth for the Navbar avatar (not next-auth session).
 * Using Zustand ensures reactive UI updates across all components subscribing to this store.
 *
 * Why Zustand instead of next-auth session.update()?
 * - Session updates are not guaranteed to trigger UI re-renders in all components
 * - Zustand subscriptions are predictable and immediate
 * - Integrates seamlessly with existing Zustand stores in the project
 */
export const useProfileImageStore = create<ProfileImageState>((set) => ({
  image: null,
  setImage: (image: string) => set({ image }),
  clearImage: () => set({ image: null }),
}))
