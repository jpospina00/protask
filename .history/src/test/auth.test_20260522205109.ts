import { describe, it, expect, vi } from "vitest";
import * as authService from "@/services/api/auth";

describe("Auth Service", () => {
  it("login con credenciales correctas", async () => {
    const user = await authService.login(
      "ana.garcia@protask.com",
      "password123",
    );
    expect(user).toBeDefined();
    expect(user.email).toBe("ana.garcia@protask.com");
  });

  it("login con credenciales incorrectas lanza error", async () => {
    await expect(
      authService.login("malo@test.com", "wrongpass"),
    ).rejects.toThrow("Credenciales inválidas");
  });

  it("registro de nuevo usuario", async () => {
    const user = await authService.register({
      name: "Test User",
      email: "test@test.com",
      password: "123456",
      role: "Developer",
    });
    expect(user).toBeDefined();
    expect(user.email).toBe("test@test.com");
  });

  it("logout limpia la sesión", async () => {
    await authService.logout();
    const user = await authService.getCurrentUser();
    expect(user).toBeNull();
  });
});
