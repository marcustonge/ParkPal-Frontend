import {
  Box,
  Flex,
  Heading,
  Button,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import React, { useState } from "react";
import NavigationBar from "../../components/navbar/navbar";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const baseUrl = (process.env.REACT_APP_AUTH_SERVICE_ENDPOINT);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(`${baseUrl}/auth/delete/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete account");
      }
      toast({
        title: "Account Deleted",
        description: "Your account has been deleted successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Failed to delete account.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <NavigationBar />
      <Flex align={"center"} justify={"center"} bg={"gray.50"} minH={'92vh'}>
        <Box p={8}>
          <Flex alignItems="center" justify={'center'} flexDirection={'column'}>
            <Heading as="h1" fontSize="4xl" fontWeight="bold">
              Manage your account
            </Heading>
            <Box py={2} />
            <Button colorScheme="blue" onClick={() => {
                localStorage.removeItem('token');
                navigate("/");
              }}>
                Sign Out
              </Button>

            <Box py={4}>
              <Button colorScheme="red" onClick={() => setIsDeleteDialogOpen(true)}>
                Delete Account
              </Button>
              <AlertDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                leastDestructiveRef={undefined}
              >
                <AlertDialogOverlay>
                  <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                      Delete Account
                    </AlertDialogHeader>

                    <AlertDialogBody>
                      Are you sure? This action cannot be undone.
                    </AlertDialogBody>

                    <AlertDialogFooter>
                      <Button onClick={() => setIsDeleteDialogOpen(false)}>
                        No
                      </Button>
                      <Button colorScheme="red" onClick={handleDeleteAccount} ml={3}>
                        Yes
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
            </Box>

          </Flex>
        </Box>
      </Flex>
    </>
  );
};

export default ProfilePage;