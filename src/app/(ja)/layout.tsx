import { ja } from "@/data/profile";
import DocumentLayout, { pageMetadata } from "@/components/document-layout";

export const metadata = pageMetadata(ja);

export default function JapaneseLayout({ children }: { children: React.ReactNode }) {
  return <DocumentLayout locale="ja">{children}</DocumentLayout>;
}
