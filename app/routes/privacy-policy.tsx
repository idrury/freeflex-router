import { Route } from "../+types/root";
import PrivacyPolicy from "~/Pages/PrivacyPolicy";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Privacy policy" },
    { name: "description", content: "The privacy policy for FreeFlex" },
  ];
}

export default function LoadPrivacyPolicy() {
  return <PrivacyPolicy authorized={false} menuVisible={false} inShrink={false}  />;
}
