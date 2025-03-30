import Link from "next/link";
import { Button } from "./ui/button";
import { signOut } from "@/lib/actions/auth.action";
import { createClient } from "@/lib/supabase/server";

const Header = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="h-16 flex items-center justify-between lg:-mb-16 px-4 xl:px-0">
      <Link href={"/"}>
        <h1 className="text-2xl font-bold">PREPICAGO</h1>
      </Link>
      {user && (
        <p className="text-muted-foreground hidden lg:block">
          Hello,{" "}
          <span className="font-semibold">
            {user?.user_metadata.displayName}
          </span>
        </p>
      )}
      <Button onClick={signOut} className="btn">
        Sign Out
      </Button>
    </header>
  );
};

export default Header;
