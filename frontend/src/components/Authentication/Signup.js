import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React ,{useState}from 'react';
import { useToast } from "@chakra-ui/react";
import axios from 'axios';
import { useHistory } from "react-router-dom";

const Signup = () => {
    const [show, setShow] = useState();
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [confirmpassword, setConfirmpassword] = useState();
    const [password, setPassword] = useState();
    const [pic, setPic] = useState();
    const [loading, setLoading] = useState(false)
    const toast = useToast();
    const history = useHistory();


    const handleClick=()=>setShow(!show);

    const postDetails=(pics)=>{
     setLoading(true);
     if (pics === undefined){
       toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
       });
       return;
     }

     if(pics.type !== "image/jpeg" && pics.type!=="image/png"){
        toast({
            title: "Please Select a JPEG or PNG Image!",
            status: "warning",
            duration: 5000,
            isClosable: true,   
            position: "bottom",
        });
        setLoading(false);
        return;
     }

     if (pics.type === "image/jpeg" || pics.type === "image/png") {

      const data = new FormData()
      data.append("file", pics)
      data.append("upload_preset", "ChatApp")
      data.append("cloud_name", "pranay28")
      axios.post("https://api.cloudinary.com/v1_1/pranay28/image/upload", data)
        .then((response) => {
          console.log("Cloudinary response:", response);
          setPic(response.data.url.toString());
          setLoading(false);
          toast({
            title: "Image uploaded successfully!",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        })
        .catch((error) => {
          console.log("Cloudinary error:", error);
          setLoading(false);
        });
    }
  }

    const submitHandler= async ()=>{
        setLoading(true);
        if(!name || !email || !password || !confirmpassword) {
            toast({
                title: "Please Fill all the feilds",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }
        if (password !== confirmpassword) {
            toast({
                title: "Passwords Do Not Match",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };

            const {data } = await axios.post("/api/user", {name, email, password, pic},config);
            toast({
                title: "Registration Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });

            localStorage.setItem("userInfo", JSON.stringify(data));

            setLoading(false);
            history.push('/chats')
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    };




  return (
    <VStack spacing='5px' color='black'>
        <FormControl id='first-name' isRequired>
            <FormLabel color={"rgb(208, 238, 198)"}>
                Name
            </FormLabel>
            <Input
            color={'white'}
            borderColor={"rgb(208, 238, 198)"}
            placeholder='Enter Your Name'
            onChange={(e)=>setName(e.target.value)}/>
        </FormControl>
        <FormControl id='email' isRequired>
            <FormLabel color={"rgb(208, 238, 198)"}>
                Email
            </FormLabel>
            <Input
            color={'white'}
            borderColor={"rgb(208, 238, 198)"}
            placeholder='Enter Your Email'
            onChange={(e)=>setEmail(e.target.value)}/>
        </FormControl>
        <FormControl id='password' isRequired>
            <FormLabel color={"rgb(208, 238, 198)"}>Password</FormLabel>
            <InputGroup>
                <Input
                color={'white'}
                borderColor={"rgb(208, 238, 198)"}
                type={show?'text':'password'}
                placeholder='Enter Your password'
                onChange={(e)=>setPassword(e.target.value)}/>
                <InputRightElement width='4.5rem'>
                    <Button bg={"rgb(208, 238, 198)"} h='1.75rem' size='sm' onClick={handleClick}>
                        {show?'hide':'show'}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id='password' isRequired>
            <FormLabel color={"rgb(208, 238, 198)"}>Confirm password</FormLabel>
            <InputGroup size='md'>
                <Input
                color={'white'}
                borderColor={"rgb(208, 238, 198)"}
                type={show?'text':'password'}
                placeholder='Confirm password'
                onChange={(e)=>setConfirmpassword(e.target.value)}/>
                <InputRightElement  width='4.5rem'>
                    <Button bg="rgb(208, 238, 198)" h='1.75rem' size='sm' onClick={handleClick}>
                        {show?'hide':'show'}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id='pic' isRequired>
            <FormLabel color={"rgb(208, 238, 198)"}>
                Upload your picture
            </FormLabel>
            <Input
            color={'white'}
            type="file"
            borderColor={"rgb(208, 238, 198)"}
            p={1.5}
            accept="image/*"
            placeholder='Enter Your Email'
            onChange={(e)=>postDetails(e.target.files[0])}/>
        </FormControl>
        <Button
        bg='rgb(208, 238, 198)'
        width='100%'
        style={{marginTop:15}}
        onClick={submitHandler}
        isLoading={loading}>
            Signup
        </Button>
    </VStack>
  )
}

export default Signup
