import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h2>Bienvenida 👋</h2>
      <p>Sesión iniciada como: {user?.email}</p>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
}
