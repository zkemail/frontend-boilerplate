interface AuthState {
  username: string | null;
  token: string | null;
  isLoading: boolean;
  isAdmin: boolean;
}

class AuthStore {
  private state: AuthState = {
    username: null,
    token: null,
    isLoading: false,
    isAdmin: false,
  };

  private listeners: Set<() => void> = new Set();

  private constructor() {
    // Load initial state from localStorage
    const savedAuth = localStorage.getItem('auth-storage');
    if (savedAuth) {
      const parsed = JSON.parse(savedAuth);
      this.state = {
        ...this.state,
        username: parsed.username ?? null,
        token: parsed.token ?? null,
        isAdmin: parsed.isAdmin ?? false,
      };
    }
  }

  private static instance: AuthStore | null = null;

  static getInstance(): AuthStore {
    if (!AuthStore.instance) {
      AuthStore.instance = new AuthStore();
    }
    return AuthStore.instance;
  }

  private setState(newState: Partial<AuthState>) {
    this.state = { ...this.state, ...newState };
    
    // Persist relevant data to localStorage
    localStorage.setItem('auth-storage', JSON.stringify({
      username: this.state.username,
      token: this.state.token,
      isAdmin: this.state.isAdmin,
    }));

    // Notify listeners
    this.listeners.forEach((listener) => listener());
  }

  getState(): AuthState {
    return { ...this.state };
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  setAuth(username: string, token: string, isAdmin: boolean): void {
    this.setState({ username, token, isAdmin });
  }

  clearAuth(): void {
    this.setState({ username: null, token: null, isAdmin: false });
  }

  setLoading(loading: boolean): void {
    this.setState({ isLoading: loading });
  }
}

export const authStore = AuthStore.getInstance(); 