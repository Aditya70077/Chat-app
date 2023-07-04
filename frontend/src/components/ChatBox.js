import React from 'react';
import { Box } from "@chakra-ui/react";
import  SingleChat  from './SingleChat';
import { ChatState } from '../Context/ChatProvider';

const ChatBox = ({ fetchAgain, setFetchAgain}) => {
  const { selectedChat } = ChatState();

  return (
    <Box
     display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
     alignItems="left"
     flexDir="column"
     p={3}
     bg="rgb(12, 23, 22)"
     w={{ base: "100%", md: "68%" }}
     borderRadius="lg"
     borderWidth="1px"
    >
     <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </Box>
  )
}

export default ChatBox