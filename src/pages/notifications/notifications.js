import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Text,
  Stack,
  Heading,
  useToast,
  Flex,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import NavigationBar from "../../components/navbar/navbar";

const NotificationsPage = () => {
  const baseUrl = (process.env.REACT_APP_NOTIFICATION_SERVICE_ENDPOINT);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const toast = useToast();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${baseUrl}/notification/info`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      const data = await response.json();


      setNotifications(data.reverse());
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch notifications");
      setLoading(false);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const response = await fetch(`${baseUrl}/notification/delete/${notificationId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }
      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notification) => notification._id !== notificationId
        )
      );
      toast({
        title: "Notification deleted.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to delete notification.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const clearAllNotifications = async () => {
    // make a request to the notifications microservice to clear all notifications
    try {
      const response = await fetch(`${baseUrl}/notification/delete-all`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }
      setNotifications((prevNotifications) => []);
      toast({
        title: "Cleared all notifications.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to delete all notifications.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <NavigationBar />
      <Flex align={"center"} justify={"center"} bg={"gray.50"} minH={"92vh"}>
        <Box p={4}>
          {loading ? (
            <Text>Loading...</Text>
          ) : error ? (
            <Text fontSize={24}>Oops, an error occurred.</Text>
          ) : notifications.length === 0 ? (
            <Text fontSize={24}>You have no notifications.</Text>
          ) : (
            <Stack spacing={4} minW={"50vw"}>
              <Heading as="h1" mb={4} textAlign={"center"}>
                Your Notifications
              </Heading>
              <Button onClick={clearAllNotifications} mb={4}>
                Clear all
              </Button>
              {notifications.map((notification) => (
                <Box
                  key={notification._id}
                  p={4}
                  display={"flex"}
                  flexDir={"row"}
                  justifyContent={"space-between"}
                  borderWidth={1}
                  borderRadius={4}
                >
                  <div>
                    <Text mr={4} fontSize={20} as="u">
                      <strong></strong>
                      {notification.title}
                    </Text>
                    <Text mr={4}>
                      <strong>Date:</strong>{" "}
                      {new Date(notification.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      -{" "}
                      {new Date(notification.date).toLocaleTimeString("en-US")}
                    </Text>
                    <Text flex="1">
                      <strong>Description:</strong> {notification.description}
                    </Text>
                  </div>
                  <Button
                    rightIcon={<CloseIcon />}
                    aria-label="Delete notification"
                    onClick={() => deleteNotification(notification._id)}
                  >
                    Delete
                  </Button>
                </Box>
              ))}
            </Stack>
          )}
        </Box>
      </Flex>
    </>
  );
};

export default NotificationsPage;
