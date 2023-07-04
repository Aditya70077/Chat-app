import React, { useState, useEffect }from 'react';
import axios from 'axios';
import { Box, Stack, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button"
import { useToast } from "@chakra-ui/react";
import { ChatState } from '../Context/ChatProvider';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import GroupChatModal  from "./miscellaneous/GroupChatModal";
import { getSender } from '../config/ChatLogics';

const MyChats = ({ fetchAgain }) => {
    const [loggedUser, setLoggedUser] = useState("");
    const { selectedChat, setSelectedChat, user, chats, setChats} = ChatState();

    const toast = useToast();

   const fetchChats = async() => {
      console.log(user._id);
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };

        const { data } = await axios.get("/api/chat", config);
        setChats(data);
    } catch (error) {
        toast({
            title: "Error Occured",
            description: "Failed to Load the chats",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
        });
    }
   };

   useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
   }, [fetchAgain])

  return (
    <Box 
     display={{ base: selectedChat ? "none" : "flex", md: "flex"}}
     flexDir="column"
     alignItems="center"
     p={3}
     bg='rgb(12, 23, 22)'
     w={{base: "100%", md: "31%"}}
     borderRadius="lg"
     borderWidth="1px"
    >

     <Box
      pb={3}
      px={3}
      fontSize={{ base: "28px", md: "30px"}}
      fontFamily="Work sans"
      d="flex"
      w="100%"
      justifyContent="space-between"
      alignSelf={'flex-start'}
      color={'rgb(208, 238, 198)'}
     >
      My Chats
      <GroupChatModal>
        <Button
      display={'flex'}
      alignSelf='flex-end'
      colorScheme={'teal.800'}
      color='rgb(208, 238, 198)'
      rightIcon={<AddIcon/>}
      >
       New Group Chat
      </Button>
      </GroupChatModal>
      
     </Box>

     <Box
      display="flexbox"
      p={3}
      bg="rgb(44, 66, 63)"
      w="100%"
      h="100%"
      borderRadius="lg"
      overflowY="hidden"
     >
       {chats ? (
        <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "rgb(12, 23, 22)" : "rgb(44, 66, 63)"}
                color={'white'}
                fontSize={'20px'}
                px={5}
                py={3}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
       ):(
        <ChatLoading/>
       )}
     </Box>

    </Box>
  )
}

export default MyChats