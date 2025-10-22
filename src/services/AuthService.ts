import axios from "axios";

const API_BASE_URL = "https://jkvoca-api.ncloud.sbs";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  username: string;
}

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await axios.post<LoginResponse>(
      `${API_BASE_URL}/v1/auth/login`,
      credentials,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // 토큰을 localStorage에 저장
    if (response.data.accessToken) {
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("username", response.data.username);
    }

    return response.data;
  }

  logout(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
  }

  getAccessToken(): string | null {
    return localStorage.getItem("accessToken");
  }

  getUsername(): string | null {
    return localStorage.getItem("username");
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

export default new AuthService();
