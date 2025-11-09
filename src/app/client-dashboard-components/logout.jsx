import { useRouter } from "next/navigation";
import { LogOut,Loader2 } from "lucide-react";
import { useState } from "react";
const Logout = () => {
  const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
    try{
      setLoading(true);
      await fetch("/api/logout", { method: "POST" });
    localStorage.removeItem("user");
    localStorage.removeItem("selectedBot");
    localStorage.removeItem("user-bots");
    router.push("/login"); // go to login
    }
    catch(err){
      console.error("Logout failed:", err);
    }
    finally{
      setLoading(false);
    } 
  };

    return (
        <button className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white w-full transition-colors cursor-pointer" onClick={handleLogout}>
                <LogOut size={18} />
                {loading ? (
                  <div className="flex items-center">
                    <Loader2 className="animate-spin mr-2 w-4 h-4" /> Logging out...
                  </div>
                ) : (
                  <span>Logout</span>
                )}
        </button>
    )
}
export default Logout;