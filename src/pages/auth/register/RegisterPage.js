import { useForm } from 'react-hook-form'
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  useToast,
} from "@chakra-ui/react";

const RegisterPage = () => {
  const baseUrl = process.env.REACT_APP_AUTH_SERVICE_ENDPOINT;
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      const { email, password, firstName, lastName } = values;
      const response = await fetch(`${baseUrl}/auth/register`, {
        method: "POST",
        cors: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          fullName: firstName + " " + lastName,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          console.log(data);
          throw new Error(data["message"] ?? "incorrect format.");
        }

        throw new Error("Something went wrong");
      }

      if (!data["token"]) {
        console.log("No token found in response");
        throw new Error("Something went wrong");
      }

      // Store the token in local storage.
      localStorage.setItem("token", data["token"]);

      toast({
        title: "Success!",
        description: "We've registered you to the application!.",
        status: "success",
        isClosable: true,
      });

      navigate("/");
    } catch (error) {
      console.log(error);
      toast({
        title: "An error occurred.",
        description: `Login failed. ${
          error.message ?? "something went wrong."
        }`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return <RegisterPageView onSubmit={(values) => handleSubmit(values)} />;
};

export default RegisterPage;

const RegisterPageView = ({ onSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);
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
    <Flex minH={"100vh"} align={"center"} justify={"center"} bg={"gray.50"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign up
          </Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            to enjoy all of our cool features ✌️
          </Text>
        </Stack>
        <form onSubmit={handleSubmit(onSubmit)}>
        <Box rounded={"lg"} bg={"white"} boxShadow={"lg"} p={8}>
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl id="firstName" isRequired>
                  <FormLabel>First Name</FormLabel>
                  <Input type="text" />
                </FormControl>
              </Box>
              <Box>
                <FormControl id="lastName">
                  <FormLabel>Last Name</FormLabel>
                  <Input type="text" />
                </FormControl>
              </Box>
            </HStack>
            <FormControl id="email" isRequired isInvalid={errors.email}>
              <FormLabel>Email address</FormLabel>
              <Input id='email' placeholder='joeblogs@gmail.com'
                   {...register('email', {
                    required: 'This is required',
                    validate: (value) => validateEmail(value) || 'Email should be valid',
                  })}
                />
            </FormControl>
            <FormControl id="password" isRequired isInvalid={errors.password}>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input 
                  id='password' 
                  placeholder="********"
                  type={showPassword ? "text" : "password"} 
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must have at least 8 characters",
                    },
                  })}
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  ></Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                isLoading={isSubmitting}
                type="submit"
              >
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Already a user?{" "}
                <Button as={NavLink} to="/login" color={"blue.400"}>
                  Login
                </Button>
              </Text>
            </Stack>
          </Stack>
        </Box>
        </form>
      </Stack>
    </Flex>
  );
};
