import React, { useState, useEffect } from "react";
import NavigationBar from "../../components/navbar/navbar";
import {
  Box,
  Button,
  Center,
  Input,
  Stack,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Select,
  Spinner,
  Flex,
  VStack,
  Heading,
  Grid,
  GridItem,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";

const API_URL = process.env.REACT_APP_LOCATION_SERVICE_ENDPOINT;

const ParkingAreasPage = () => {
  const [postcode, setPostcode] = useState("");
  const [radius, setRadius] = useState(1);
  const [parkingAreas, setParkingAreas] = useState([]);
  const [selectedParkingArea, setSelectedParkingArea] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [expiryTime, setExpiryTime] = useState(0);
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handlePostcodeChange = (e) => {
    setPostcode(e.target.value);
  };

  const handleSearchClick = async () => {
    try {
      const response = await fetch(
        `${API_URL}/location/parking-locations?postcode=${postcode}&radius=${radius}`
      );
      const data = await response.json();
      // const data = [
      //   {
      //     _id: 1,

      //     Title: "Test Location1",
      //     street_address: "123 Address Road",
      //     postcode: "SSFU",
      //     city: "London",
      //     spaces_available: 100,
      //   },
      // ];
      setParkingAreas(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleParkingAreaClick = (parkingArea) => {
    setSelectedParkingArea(parkingArea);
    onOpen();
  };

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
  };

  const handleExpiryTimeChange = (e) => {
    setExpiryTime(e.target.value);
  };

  const handleBookingSubmit = async () => {
    setIsBookingLoading(true);
    setBookingError(null);

    const bookingServiceBaseUrl = process.env.REACT_APP_BOOKING_SERVICE_ENDPOINT;

    console.log(selectedParkingArea);
    console.log(startTime);

    const expiryHours = parseInt(expiryTime);

    try {
      const response = await fetch(
        `${bookingServiceBaseUrl}/bookings/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            location_id: selectedParkingArea,
            start_time: startTime,
            expires_hours: expiryHours,
          }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        setStartTime("");
        setExpiryTime(0);
        onClose();
        alert("Booking Confirmed");
      } else {
        setBookingError(data.error);
      }
    } catch (error) {
      console.error(error);
      setBookingError(
        "An error occurred while booking. Please try again later."
      );
    }

    setIsBookingLoading(false);
  };

  return (
    <>
      <NavigationBar />
      <Flex align={"center"} justify={"center"} bg={"gray.50"} minH={"92vh"}>
        <Box p={4}>
          <Center display={"flex"} flexDir={"column"} >
            <Heading as="h1" mb={4}>
              Find a Space
            </Heading>
            <Stack direction="row" spacing={4} mb={4} maxW={"50vw"}>
              <Stack direction="column" spacing={4} mb={4} maxW={"50vw"}>
                <Input
                  placeholder="Postcode"
                  value={postcode}
                  onChange={handlePostcodeChange}
                />
                <Stack direction="row" mb={4} >
                  <Text my={2} >Radius (miles): </Text>
                  <NumberInput
                    value={radius}
                    onChange={(value) => {
                      const intValue = parseInt(value);
                      if (!isNaN(intValue) && intValue > 0) {
                        setRadius(
                          intValue
                        );
                      }
                    }
                    }
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </Stack>

              </Stack>
              <Button colorScheme="teal" onClick={handleSearchClick}>
                Search
              </Button>
            </Stack>
          </Center>
          <Grid gap={6} templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)', 'repeat(3, 1fr)', 'repeat(4, 1fr)',]}>
            {parkingAreas.map((parkingArea) => (
              <GridItem
                key={parkingArea._id}
                p={4}
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                mb={4}
              >
                <VStack >
                  <Heading as="h2" fontSize="xl" mb={2} textAlign="center">
                    {parkingArea.Title}
                  </Heading>
                  <Text fontSize="md" mb={2} textAlign="center">
                    {parkingArea.street_address}
                  </Text>
                  <Text fontSize="md" mb={2} textAlign="center">
                    {parkingArea.city}
                  </Text>
                  <Text fontSize="md" mb={2} textAlign="center">
                    {parkingArea.postcode}
                  </Text>
                  {parkingArea.spaces_available === 0 ? (
                    <Text color="gray.500">No spaces available</Text>
                  ) : (
                    <>
                      <Text>Spaces available: {parkingArea.spaces_available}</Text>
                      <Button onClick={() => handleParkingAreaClick(parkingArea._id)} colorScheme="teal">Book a space</Button>
                    </>
                  )}
                </VStack>
              </GridItem>
            ))}
          </Grid>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Book a Space</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl mb={4}>
                  <FormLabel>Start Time</FormLabel>
                  <Input
                    type="datetime-local"
                    value={startTime}
                    onChange={handleStartTimeChange}
                  // min={Date.now()}
                  />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Expiry Time</FormLabel>
                  <Select value={expiryTime} onChange={handleExpiryTimeChange}>
                    <option value="0" disabled>
                      Choose an expiry time
                    </option>
                    <option value="1">1 hour</option>
                    <option value="2">2 hours</option>
                    <option value="3">3 hours</option>
                    <option value="4">4 hours</option>
                    <option value="5">5 hours</option>
                    <option value="6">6 hours</option>
                    <option value="7">7 hours</option>
                    <option value="8">8 hours</option>
                    <option value="9">9 hours</option>
                    <option value="10">10 hours</option>
                    <option value="11">11 hours</option>
                    <option value="12">12 hours</option>
                  </Select>
                </FormControl>
                {isBookingLoading ? (
                  <Spinner />
                ) : (
                  <>
                    {bookingError && (
                      <Text color="red.500" mb={4}>
                        {bookingError}
                      </Text>
                    )}
                    <Button
                      colorScheme="teal"
                      onClick={handleBookingSubmit}
                    // isDisabled={!startTime || !expiryTime}
                    >
                      Book
                    </Button>
                  </>
                )}
              </ModalBody>
            </ModalContent>
          </Modal>
        </Box>
      </Flex>
    </>
  );
};

export default ParkingAreasPage;
