import type { Metadata } from "next";
import { ClubAuthClient } from "./ClubAuthClient";

export const metadata: Metadata = {
  title: "Espace Clubs | NightTable",
  description: "Connexion et inscription dédiées aux clubs partenaires NightTable.",
};

export default function ClubsAccessPage() {
  return <ClubAuthClient />;
}
