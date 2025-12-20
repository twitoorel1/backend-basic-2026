// app/page.tsx

// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import LoginPage from "./login/page";
import DashboardPage from "./(dashboard)/dashboard/page";
import DashboardLayout from "./(dashboard)/layout";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getCurrentUser();
  // const session = await getServerSession(authOptions);

  // if (user === undefined) {
  //   return (
  //     <div>
  //       <p>Loading...</p>
  //     </div>
  //   );
  // }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <DashboardLayout>
      <DashboardPage />
    </DashboardLayout>
  );
}
