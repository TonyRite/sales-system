import pb from '@/api/Pocketbase';
import { useMutation } from 'react-query';

export type AuthRec = {
  email: string;
  password: string;
}
export default function useLogin(){
  async function login({ email, password }: AuthRec) {
      const authData = await pb
      .collection('users')
      .authWithPassword(email,password);
      console.log(authData);   
    }
    return useMutation(login);
}
