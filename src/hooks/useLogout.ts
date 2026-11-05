import { useNavigate } from "react-router";
import { useAuth } from "./useAuth";

/** Logs the user out and returns to the catalog. The cart is intentionally kept. */
export function useLogout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return () => {
    logout();
    navigate("/");
  };
}
