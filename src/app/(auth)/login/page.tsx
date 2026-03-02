// Component: LoginPage
// Reference: component.gallery/components/tabs
// Inspired by: Velvet Rope split-auth pattern
// NightTable usage: login route rendering shared auth split-screen page

import { AuthSplitPage } from "@/app/(auth)/AuthSplitPage";

import type { ReactElement } from "react";

export default function LoginPage(): ReactElement {
  return <AuthSplitPage initialTab="login" />;
}
