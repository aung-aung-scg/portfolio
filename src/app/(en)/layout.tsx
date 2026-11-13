import { en } from "@/data/profile";
import DocumentLayout, { pageMetadata } from "@/components/document-layout";

export const metadata = pageMetadata(en);

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return <DocumentLayout locale="en" includePerson>{children}</DocumentLayout>;
}
