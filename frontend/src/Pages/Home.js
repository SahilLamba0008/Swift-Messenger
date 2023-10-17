import { Box, Container, Text} from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import React, { useEffect } from 'react';
import Login from '../Components/Authentication/Login.js';
import Signup from '../Components/Authentication/Signup.js';
import { useNavigate } from 'react-router-dom';
// import ChatPage from './ChatPage';


const Home = () => {
    const navigate = useNavigate();
    useEffect(()=>{
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));

        // Check if user is logged in - as user info will be stored in local storage
        if(!userInfo){  
            navigate('/');
        }
    },[navigate]);
    
  return (
    <Container maxW='xl'>
      {/* Header Box */}
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        p={4}
        margin='50px 0 15px 0'
        bg='#'
        w='100%'
        borderRadius='lg'
        borderColor='#'
        borderWidth='1px'
      >
        <Text fontSize='4xl' fontFamily='Work sans' fontWeight='700' textAlign='center'>
          Swift Messenger
        </Text>
      </Box>

      {/* Tabs Box */}
      <Box bg="" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab>Log In</Tab>
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
  );
};

export default Home;
