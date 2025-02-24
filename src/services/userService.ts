import { CredentialResponse } from '@react-oauth/google';
import { apiClient } from './apiClient';

export interface User {
  _id?: string;
  email: string;
  password: string;
  avatar?: string;
}

export const googleSignin = (credentialResponse: CredentialResponse) => {
  return new Promise<User>((resolve, reject) => {
    console.log('googleSignin ...');

    apiClient
      .post('/auth/login', credentialResponse)
      .then((response) => {
        console.log(response);
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};
