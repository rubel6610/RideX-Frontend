import { useAuth } from '@/app/hooks/AuthProvider';

export const useLogout = () => {
  const { user, logout } = useAuth();

  const logoutHandler = async () => {
    try {
      if (user?.id && user?.role === "rider") {
        await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/status/offline`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        });
      }
    } catch (err) {
      console.error("Failed to set offline:", err);
    } finally {
      logout();
    }
  };

  return logoutHandler;
};
