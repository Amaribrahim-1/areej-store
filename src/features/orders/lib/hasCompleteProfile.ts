import type { MyProfile } from "@/types/profile";

export type CompleteProfile = MyProfile & {
  fullName: string;
  phone: string;
  governorate: string;
  markaz: string;
  addressText: string;
};

/**
 * True only when every delivery field is filled. A partially-filled profile
 * (e.g. name but no address) is treated the same as no profile — checkout
 * needs the full set to place an order, so the "complete your data" prompt
 * should show for either case, not just when everything is empty.
 */
export function hasCompleteProfile(
  profile: MyProfile | null,
): profile is CompleteProfile {
  return Boolean(
    profile?.fullName &&
      profile.phone &&
      profile.governorate &&
      profile.markaz &&
      profile.addressText,
  );
}
