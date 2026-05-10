import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    signOut, 
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    type User 
  } from 'firebase/auth';
import app from "./config";
  
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
  
provider.setCustomParameters({
    prompt: 'select_account'
});
  
export const signInWithGoogle = async (): Promise<User | null> => {
    try {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user' || error.message.includes('window.closed')) {
         console.warn("Вікно заблоковано браузером, але перевірте стан авторизації.");
      }
      console.error("Помилка авторизації Google:", error);
      return null;
    }
};

export const registerWithEmail = async (email: string, password: string, name: string): Promise<User | null> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        return userCredential.user;
    } catch (error) {
        console.error("Помилка реєстрації:", error);
        throw error;
    }
};

export const loginWithEmail = async (email: string, password: string): Promise<User | null> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Помилка входу:", error);
        throw error;
    }
};
  
export const logout = async () => await signOut(auth);
  
export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
};