import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      user: {
        displayName: "John Doe",
        email: "johndoe@aol.com",
        photoURL: "https://avatars.githubusercontent.com/u/739984?v=4",
        emailVerified: true,
        uid: "123lkasdfkalsdf66",
      },
      loading: false,
    };
  },
  actions: {
    setUser() {
      this.loading = true;
    },
    async signOut() {
      console.log("user signed out!");
    },
  },
});
