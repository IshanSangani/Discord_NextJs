'use client';

import { useCallback, useEffect, useState } from "react";
import {User} from 'stream-chat';
import { LoadingIndicator } from "stream-chat-react";
import { useClerk } from '@clerk/nextjs';
import MyChat from "@/components/MyChat";

type HomeState = {
  apiKey: string,
  user: User,
  token: string
};

export default function Home(){
  const  [homeState,setHomeState] = useState<HomeState | undefined>();

  const { user: clerkUser } = useClerk();

  const registerUser = useCallback(
    async function registerUser() {
      // register user on Stream backend
      console.log('[registerUser] myUser:', clerkUser);
      const userId = clerkUser?.id;
      const mail = clerkUser?.primaryEmailAddress?.emailAddress;
      if (userId && mail) {
        const streamResponse = await fetch('/api/register-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,
            email: mail,
          }),
        });
        const responseBody = await streamResponse.json();
        console.log('[registerUser] Stream response:', responseBody);
        return responseBody;
      }
    },
    [clerkUser]
  );
  async function getUserToken(userId: string, userName: string) {
    const response = await fetch('/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
      }),
    });
    const responseBody = await response.json();
    const token = responseBody.token;

    if (!token) {
      console.error("Couldn't retrieve token.");
      return;
    }

    const user: User = {
      id: userId,
      name: userName,
      image: `https://getstream.io/random_png/?id=${userId}&name=${userName}`,
    };
    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
    if(apiKey){
      setHomeState({
      apiKey: apiKey,
      user: user,
      token: token,
    });}
   
  }
  useEffect(() => {
    if (
      clerkUser?.id &&
      clerkUser?.primaryEmailAddress?.emailAddress &&
      !clerkUser?.publicMetadata.streamRegistered
    ) {
      console.log('[Page - useEffect] Registering user on Stream backend');
      registerUser().then((result) => {
        console.log('[Page - useEffect] Result: ', result);
        getUserToken(
          clerkUser.id,
          clerkUser?.primaryEmailAddress?.emailAddress || 'Unknown'
        );
      });
    } else {
      // take user and get token
      if (clerkUser?.id) {
        console.log(
          '[Page - useEffect] User already registered on Stream backend: ',
          clerkUser?.id
        );
        getUserToken(
          clerkUser?.id || 'Unknown',
          clerkUser?.primaryEmailAddress?.emailAddress || 'Unknown'
        );
      }
    }
  }, [registerUser, clerkUser]);


  if(!homeState){
    return <LoadingIndicator/>

  }

  return <MyChat{...homeState}/>;
}