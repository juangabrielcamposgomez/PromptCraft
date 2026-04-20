"use client";

import { useAuth } from "@devflow/core";

export function AuthDemo() {
  const { user, isAuthenticated, login, logout } = useAuth();

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px", marginTop: "20px" }}>
      <h2>Shared Logic Demo (Auth)</h2>
      {isAuthenticated ? (
        <div>
          <p>Welcome, <strong>{user?.name}</strong>!</p>
          <button onClick={logout} style={{ padding: "8px 16px", cursor: "pointer" }}>Logout</button>
        </div>
      ) : (
        <div>
          <p>You are not logged in.</p>
          <button 
            onClick={() => login({ id: "1", name: "Arquitecto Senior", email: "arquitecto@example.com" })}
            style={{ padding: "8px 16px", cursor: "pointer" }}
          >
            Login as Senior Architect
          </button>
        </div>
      )}
    </div>
  );
}
