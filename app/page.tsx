import { redirect } from "next/navigation";

export default function Home() {
  redirect("/pembeli");
  return null;
}