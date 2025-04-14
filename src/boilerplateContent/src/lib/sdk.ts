import zkeSdk from "@zk-email/sdk";
import { authStore } from "./auth-store";

const auth = {
  getToken: async () => {
    const { token } = authStore.getState();
    return token;
  },
  onTokenExpired: async () => {
    authStore.clearAuth();
  },
};

const sdk = zkeSdk({ auth });

export default sdk;
