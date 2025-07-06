import { defineStore } from 'pinia'
import config from '@/config'
import {ref} from 'vue';
import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    User
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import {useLocalStorage} from "@vueuse/core";

const app = initializeApp(config.firebaseConfig);
const auth = getAuth(app);

const UID_KEY = '_sfx_ap_k';

export const useFirebaseStore = defineStore('firebase', {
    state: () => {
        return {
            user: ref<User|null>(null),
            uid: useLocalStorage(UID_KEY, ''),
        }
    },
    actions: {
        async login(email :string, password :string) {
            return await signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    this.setUserInfo(userCredential.user);
                    return true;
                })
                .catch(() => {
                    return false;
                })
        },
        async logout() {
            return await signOut(auth).then(() => {
                this.setUserInfo(null);
                return true;
            }).catch(() => { return false; })
        },
        onAuthStateChanged(callback: (isLoggedIn: boolean) => void) {
            onAuthStateChanged(auth, (user) => {
                this.setUserInfo(user);
                const isLoggedIn = !!user?.uid;
                callback(isLoggedIn);
            });
        },
        setUserInfo(user: User|null) {
            this.user = user;
            this.uid = this.user?.uid || '';
        },
        isLoggedIn() {
            return !!this.uid;
        },
    }
})