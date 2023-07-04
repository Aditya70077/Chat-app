import React from 'react'
import {Container,Box,Text,Tab,TabList,TabPanels,TabPanel,Tabs} from "@chakra-ui/react"
import Login from '../components/Authentication/Login'
import Signup from '../components/Authentication/Signup';
import { useHistory } from "react-router-dom";
import { useEffect } from "react";

const Homepage = () => {


  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) history.push("/chats");
  }, [history]);





  return (
    <Container maxW='xl' centerContent>
      <Box
        d='flex'
        justifyContent="center"
        p={3}
        bg={"rgb(44, 66, 63)"}
        w="100%"
        m="90px 0 20px 0"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="rgb(44, 66, 63)" 
      >
        <Text color="rgb(208, 238, 198)" fontSize='4xl' fontFamily='Work sans' align='center'><b>ChatOasis</b></Text>
      </Box>
      <Box bg="rgb(44, 66, 63)" w="100%" p={4} borderRadius="lg" borderWidth="1px" borderColor={"rgb(44, 66, 63)"}>
        <Tabs isFitted variant="soft-rounded" colorScheme='green'>
          <TabList mb="1em">
            <Tab color={'rgb(208, 238, 198)'}>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
};

export default Homepage
