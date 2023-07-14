import React from "react";
import NavigationBar from "../../components/navbar/navbar";
import { Box, Flex, Heading, Text, Button, Image } from "@chakra-ui/react";
import ParkPalLogo from "../../assets/ParkPal.jpg";

const HomePage = () => {
  console.log("HomePage");
  const styles = {
    homePage: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: 100,
      //   height: '100vh'
    },
    title: {
      fontSize: "3rem",
      textAlign: "center",
      marginBottom: "2rem",
    },
    description: {
      textAlign: "center",
    },
  };

  return (
    <>
      <NavigationBar></NavigationBar>
      <Flex align={"center"} justify={"center"} bg={"gray.50"} minH={"92vh"}>
        <Box p={8}>
          <Box textAlign="center">
            {/* <Box>
              <Image src={ParkPalLogo} alt="ParkPal logo" maxW="300px" mb={8} mx="auto" />
            </Box> */}
            <Heading as="h1" fontSize="6xl" fontWeight="bold">
              Welcome to ParkPal!
            </Heading>
            <Text fontSize="xl" mt={4} paddingInline={20}>
              ParkPal is a parking application solution that helps you find and
              reserve parking spots quickly and easily.
            </Text>
          </Box>
        </Box>
      </Flex>
    </>
  );
};

export default HomePage;
