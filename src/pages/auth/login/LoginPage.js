import { useForm } from 'react-hook-form'
import { useToast} from '@chakra-ui/react'
import { NavLink, useNavigate } from "react-router-dom";
import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Link,
    Button,
    Heading,
    Text,
    useColorModeValue,  FormErrorMessage,
  } from '@chakra-ui/react';

const LoginPage = ({props}) => {
    const baseUrl = (process.env.REACT_APP_AUTH_SERVICE_ENDPOINT);
    const toast = useToast();
    const navigate = useNavigate();
    const handleSubmit = async (values) => {
        try{  
          const {email, password} = values;
          const response = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            cors: 'no-cors',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email,
              password: password,
            }),
          });
          const data = await response.json();

          if (!response.ok) {
            
            if (response.status === 401) {
              throw new Error('Invalid credentials');
            } 

            else if (response.status === 400) {
              console.log(data)
              throw new Error(data['message'] ?? 'incorrect format.');
            } 

            throw new Error('Something went wrong');
          } 

          if (!data['token']) {
            console.log('No token found in response');
            throw new Error('Something went wrong');
          }
          

          // Store the token in local storage.
          localStorage.setItem('token', data['token']);

          toast({
            title: 'Success!',
            description: 'We\'ve logged you in.',
            status: 'success',
            isClosable: true,
          });
          
          navigate("/");
          
        }
        catch (error){
            console.log(error)
            toast({
              title: 'An error occurred.',
              description: `Login failed. ${error.message ?? 'something went wrong.'}`,
              status: 'error',
              duration: 9000,
              isClosable: true,
            });
        }
    }

    return (
        <div className="LoginPage">
             <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={'gray.50'}>
      <LoginPageView 
              onSubmit={(values)=> handleSubmit(values)}
          />
     
    </Flex>
        </div>
    );
}

export default LoginPage;

const LoginPageView = ({onSubmit}) => {

   const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
    };


    const {
      handleSubmit,
      register,
      formState: { errors, isSubmitting },
    } = useForm()
    
    return (
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign='center' >Sign in to your account</Heading>
          <Text fontSize={'lg'} color={'gray.600'} textAlign='center'>
            to start parking with us!
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg='white'
          boxShadow={'lg'}
          p={8}>
            <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>
              <FormControl id="email" isInvalid={errors.email} >
                <FormLabel>Email address</FormLabel>
                <Input id='email' placeholder='joeblogs@gmail.com'
                   {...register('email', {
                    required: 'This is required',
                    validate: (value) => validateEmail(value) || 'Email should be valid',
                  })}
                />
                <FormErrorMessage>
                  {errors.email && errors.email.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl id="password" isInvalid={errors.password}>
                <FormLabel>Password</FormLabel>
                <Input 
                  id="password"
                  placeholder="********"

                  type="password"  

                  {...register('password', {
                    required: 'This is required',
                    minLength: { value: 8, message: 'Minimum length should be 8' },
                  })}
                />
                <FormErrorMessage>
                  {errors.password && errors.password.message}
                </FormErrorMessage>
              </FormControl>
              <Stack align={'center'} > 
                  <Button as={NavLink} to='/register' color={'blue.400'} >Click here to sign up!</Button>
              </Stack>
              <Stack spacing={10}>
                <Button
                  isLoading={isSubmitting}
                  type="submit"
                  bg={'blue.400'}
                  p={6}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}>
                  Sign in
                </Button>
              </Stack>
          </Stack>
            </form>
        </Box>
      </Stack>
    );

}