import React from "react";
import ParkPalLogo from "../../assets/ParkPal.jpg";
import { Box, Flex, Image, Button } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

const NavigationBar = () => {
  return (
    <Flex
      bg="black"
      color="white"
      justifyContent="space-between"
      alignItems="center"
      // px={10}
      maxH={"8vh"}
    >
      <Box>
        {/* <NavLink exact to="/">
          <Image
            src={ParkPalLogo}
            alt="ParkPal logo"
            objectFit="contain"
            maxW="150px"
          />
        </NavLink> */}
        <Button
          as={NavLink}
          to="/"
          fontSize={"2xl"}
          height={"8vh"}
          background={"black"}
          rounded={"0"}
          _hover={{ bg: "white", color: "black" }}
        >
          ParkPal
        </Button>
      </Box>
      <Box>
        <Button
          as={NavLink}
          to="/parking-areas"
          height={"8vh"}
          background={"black"}
          rounded={"0"}
          _hover={{ bg: "white", color: "black" }}
        >
          Find a Space
        </Button>
        
        <Button
          as={NavLink}
          to="/bookings"
          height={"8vh"}
          background={"black"}
          rounded={"0"}
          _hover={{ bg: "white", color: "black" }}
        >
          View Bookings
        </Button>
        
        <Button
          as={NavLink}
          to="/notifications"
          height={"8vh"}
          background={"black"}
          rounded={"0"}
          _hover={{ bg: "white", color: "black" }}
        >
          Notifications
        </Button>
      </Box>
      <Box>
        <Button
          as={NavLink}
          to="/profile"
          height={"8vh"}
          p={5}
          background={"black"}
          rounded={"0"}
          _hover={{ bg: "white", color: "black" }}
        >
          Profile
        </Button>
      </Box>
    </Flex>
  );
};

export default NavigationBar;
