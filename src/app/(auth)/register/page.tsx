// Component: RegisterPage
// Reference: component.gallery/components/tabs
// Inspired by: Velvet Rope split-auth pattern
// NightTable usage: register route rendering shared auth split-screen page

import { AuthSplitPage } from "@/app/(auth)/AuthSplitPage";

import type { ReactElement } from "react";

export default function RegisterPage(): ReactElement {
  return <AuthSplitPage initialTab="register" />;
}
