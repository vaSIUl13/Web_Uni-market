import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    signOut, 
    onAuthStateChanged,
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
      console.error("Помилка авторизації:", error);
      return null;
    }
};
  
export const logout = async () => await signOut(auth);
  
export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
};