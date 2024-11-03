import { useClient } from "@/hooks/useClient";
import { User } from 'stream-chat';
import ServerList from '@/components/ServerList/ServerList';
import CustomChannelList from '@/components/ChannelList/CustomChannelList';
import { useVideoClient } from '@/hooks/useVideoClient'
import MyCall from './MyCall/MyCall';
import {useDiscordContext} from '@/contexts/DiscordContext'
import {
    Chat,
    Channel,
    ChannelList,
    ChannelHeader,
    MessageList,
    MessageInput,
    Thread,
    Window,
} from 'stream-chat-react';

import 'stream-chat-react/dist/css/v2/index.css';
import CustomDateSeparator from "./MessageList/CustomDateSeparator/CustomDateSeparator";
import CustomChannelHeader from './MessageList/CustomChannelHeader/CustomChannelHeader';
import CustomMessage from "./MessageList/CustomMessage/CustomMessage";
import { customReactionOptions } from "./MessageList/CustomMessage/customMessageReactions";
import MessageComposer from "./MessageList/MessageComposer/MessageComposer";
import {StreamVideo} from '@stream-io/video-react-sdk'

export default function MyChat({
    apiKey,
    user,
    token,
}: {
    apiKey: string;
    user: User;
    token: string;
}) {
    const chatClient = useClient({
        apiKey,
        user,
        tokenOrProvider: token,
    });
    const videoClient = useVideoClient({
        apiKey,
        user,
        tokenOrProvider : token,
    })
    const {callId} = useDiscordContext();


    // Move the error check inside the component body
    if (!chatClient) {
        return <div>Error, please try again later.</div>;
    }
    if(!videoClient){
        return <div> Video Error, please try again later. </div>
    }
    return (
        <StreamVideo client={videoClient}>
          <Chat client={chatClient} theme='str-chat__theme-light'>
            <section className='flex h-screen w-screen layout'>
              <ServerList />
              <ChannelList List={CustomChannelList} sendChannelsToList={true} />
              {callId && <MyCall callId={callId} />}
              {!callId && (
                <Channel
                  Message={CustomMessage}
                  Input={MessageComposer}
                  DateSeparator={CustomDateSeparator}
                  reactionOptions={customReactionOptions}
                  HeaderComponent={CustomChannelHeader}
                >
                  <Window>
                    <MessageList />
                    <MessageInput />
                  </Window>
                  <Thread />
                </Channel>
              )}
            </section>
          </Chat>
        </StreamVideo>
      );
    }