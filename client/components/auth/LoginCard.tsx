import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
// import { Package } from "lucide-react";

const LoginCard = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 ">
      <Card className="w-full max-w-md shadow-lg border border-slate-200 bg-white py-5">
        <CardHeader className="text-center space-y-1 pb-6">
          <CardTitle className="text-2xl font-bold text-slate-900">התחברות למערכת</CardTitle>
          <CardDescription className="text-slate-500">הזן את הפרטים שלך כדי להיכנס</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
};

export default LoginCard;
