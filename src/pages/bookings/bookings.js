import React, { useState, useEffect } from "react";
import NavigationBar from "../../components/navbar/navbar";
import {
  Box,
  Heading,
  Text,
  Stack,
  Select,
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Flex,
} from "@chakra-ui/react";

const BookingsPage = () => {
  const authToken = ""; // Load from storage.
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [extendTime, setExtendTime] = useState(1);

  const bookingServiceBaseUrl = process.env.REACT_APP_BOOKING_SERVICE_ENDPOINT;


  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${bookingServiceBaseUrl}/bookings/getAllBookings`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      console.log(data);
      // const data = [
      //   { id: 1, location: "Test Location 1", address: "123 Test Address", startTime: "12:00PM - 25/7/2023", endTime: "14:00PM - 25/7/2023", },
      //   { id: 2, location: "Test Location 2", address: "1224 Test Street", startTime: "12:00PM - 25/7/2023", endTime: "14:00PM - 25/7/2023", },
      //   { id: 3, location: "Test Location 3", address: "123 Test Address", startTime: "12:00PM - 25/7/2023", endTime: "14:00PM - 25/7/2023", },
      //   { id: 4, location: "Test Location 4", address: "123 Test Address", startTime: "12:00PM - 25/7/2023", endTime: "14:00PM - 25/7/2023", },
      //   { id: 5, location: "Test Location 5", address: "123 Test Address", startTime: "12:00PM - 25/7/2023", endTime: "14:00PM - 25/7/2023", },
      // ];
      setBookings(data);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  const handleExtendBooking = (booking) => {
    setSelectedBooking(booking);
    setIsOpen(true);
  };

  const handleDeleteBooking = async (selectedBooking) => {
    try {
      const response = await fetch(`${bookingServiceBaseUrl}/bookings/delete/${selectedBooking._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        setBookings(bookings.filter((booking) => booking._id !== selectedBooking._id));
      } else {
        setError("Booking delete failed");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubmitExtend = async () => {
    setIsOpen(false);
    setExtendTime(null);
    try {
      const response = await fetch(`${bookingServiceBaseUrl}/bookings/extend/${selectedBooking._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({extend_hours: extendTime }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setBookings(
          bookings.map((booking) =>
            booking._id === selectedBooking._id ? data : booking
          )
        );
        setExtendTime(1);
        setError(null);
      } else {
        setError("Booking extension failed");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <NavigationBar />
      <Flex align={"center"} justify={"center"} bg={"gray.50"} minH={"92vh"}>
        <Box p={4}>
          <Heading as="h1" mb={4} textAlign={"center"}>
            Your Bookings
          </Heading>
          {isLoading && <Text>Loading...</Text>}
          {!isLoading && error && <Text>Oops an error occurred.</Text>}
          {!isLoading && !error && bookings.length === 0 && (
            <Text>It looks like you haven't made any bookings.</Text>
          )}
          {!isLoading && !error && bookings.length > 0 && (
            <Stack spacing={4} minW={"50vw"}>
              {bookings.map((booking) => (
                
                <Box key={booking._id} p={4} borderWidth={1} borderRadius={4} >
                  <Text fontSize={20}>
                    <strong>Street Address:</strong> {booking.street_address}
                  </Text>
                  <Text>
                    Time of Booking: {new Date(booking.start_time).toISOString().substring(0,new Date(booking.start_time).toISOString().lastIndexOf(':') ).replace('T', ' ').replaceAll('-' ,'/')}
                  </Text>
                  <Text>
                    Expiry Time: {new Date(booking.end_time).toISOString().substring(0,new Date(booking.end_time).toISOString().lastIndexOf(':') ).replace('T', ' ')}
                  </Text>
                  <Stack>
                    
                  <Button mt={4} onClick={() => handleExtendBooking(booking)}>
                    Extend booking
                  </Button>
                  <Button color={"white"} backgroundColor={"red.500"} mt={4} onClick={() => handleDeleteBooking(booking)}>
                    Delete booking
                  </Button>
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
          <AlertDialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <AlertDialogOverlay />
            <AlertDialogContent>
              <AlertDialogHeader>Extend Booking</AlertDialogHeader>
              <AlertDialogBody>
                <Text>
                  Select how many hours you wish to extend your booking by:
                </Text>
                  <Select value={extendTime} onChange={(e) => setExtendTime(e.target.value)}>
                    <option value="" disabled>
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
                {error && <Text color="red">{error}</Text>}
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsOpen(false);
                    setExtendTime(null);
                    setSelectedBooking(null);
                    setError(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  colorScheme="blue"
                  ml={3}
                  onClick={handleSubmitExtend}
                  disabled={!extendTime}
                >
                  {error ? "Try again" : "Submit"}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Box>
      </Flex>
    </>
  );
};

export default BookingsPage;
