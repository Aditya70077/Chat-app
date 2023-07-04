import React, { useState } from 'react';
import axios from 'axios';
import { Box, Text} from "@chakra-ui/layout";
import { Drawer,DrawerBody,Input, DrawerOverlay, DrawerContent,DrawerHeader, Menu, MenuButton, Tooltip, MenuList, MenuItem, MenuDivider, useToast } from "@chakra-ui/react";
import { Button } from "@chakra-ui/button";
import { Avatar } from "@chakra-ui/avatar";
import ProfileModal from './ProfileModal';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { useDisclosure } from "@chakra-ui/hooks";
import { useHistory } from "react-router-dom";
import {Spinner} from "@chakra-ui/spinner"
import { ChatState } from '../../Context/ChatProvider'; 
import { ChevronDownIcon } from "@chakra-ui/icons"

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const { user, setSelectedChat, chats, setChats } = ChatState();
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/")
  };

  const toast = useToast();

  const handleSearch = async() => {
    if(!search){
        toast({
          title: "Please Enter something in search",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top-left",
        });
        return;
    }

    try {
        setLoading(true);

        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };

        const {data} = await axios.get(`/api/user?search=${search}`, config);
        

        setLoading(false);
        setSearchResult(data);

    } catch (error) {
        console.log(error.response)
        toast({
            title: "Error Occured!",
            description: "Failed to Load the Search Results",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
        });
    }
  };

 const accessChat = async(userId) => {
    try {
        setLoadingChat(true);

        const config = {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
        };

        const { data } = await axios.post("/api/chat", {userId}, config);

        if(!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
        
        setSelectedChat(data);
        setLoadingChat(false);
        onClose();
    } catch (error) {
        toast({
            title: "Error fetching the chats",
            description: error.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
        });
    }
 };

  return (
    <>
        <Box
         display="flex"
         justifyContent="space-between"
         alignItems="center"
         bg="white"
         p="8px 12px 8px 12px"
         bgColor={"rgb(12, 23, 22)"}
         borderRadius={'5px'}
         w="97%"
         m={'10px 20px 0px 20px'}
         
        >
            <Tooltip 
            label="Search Users to chat" 
            hasArrow 
            placement="bottom-end"
            >
              <Button colorScheme='teal.800' variant='solid' onClick={onOpen}>
                <i class="fas fa-search" ></i>
                <Text d={{base: "none",md:"flex"}} px="4" color={'rgb(208, 238, 198)'}>
                    Search Users
                </Text>
              </Button>
            </Tooltip>

            <Text fontSize="3xl" color={'rgb(208, 238, 198)'}>
              ChatOasis
            </Text>
            <div>
                <Menu>
                    {/* <MenuButton p={1}>
                       <BellIcon fontSize="2xl" m={1} />
                    </MenuButton>
                    <MenuList></MenuList> */}
                </Menu>
                <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
                        <Avatar 
                           size="sm" 
                           cursor="pointer" 
                           name={user.name}
                           src={user.pic} 
                           />
                    </MenuButton>
                    <MenuList>
                        <ProfileModal user={user}>
                           <MenuItem color={'black'}>My Profile</MenuItem>
                        </ProfileModal>
                        
                        <MenuDivider />
                        <MenuItem onClick={logoutHandler} color={'black'}>Logout</MenuItem>
                    </MenuList>
                </Menu>
            </div>


        </Box>

        <Drawer placement="left" onClose={onClose} isOpen={isOpen} >
          <DrawerOverlay/>
          <DrawerContent bg={'rgb(12, 23, 22)'} >
            <DrawerHeader color={'rgb(208, 238, 198)' }>SEARCH</DrawerHeader>
            <DrawerBody>
          <Box display="flex" pb={5}>
            <Input
                color={'white'}
                borderColor={'rgb(208, 238, 198)'}
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <Button 
            bg={'rgb(208, 238, 198)'}
              onClick={handleSearch}
            >
             Go
            </Button>

          </Box>
           {loading ? (
            <ChatLoading/>
           ):(
             searchResult?.map(user => (
                <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                />
             ))
           )}
           {loadingChat && <Spinner ml="auto" display="flex"/>}

          </DrawerBody>
          </DrawerContent>
          
        </Drawer>
    </>
  )
}

export default SideDrawer;