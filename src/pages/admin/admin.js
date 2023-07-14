import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Container,
    Heading,
    VStack,
    Text,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    FormControl,
    FormLabel,
    Input,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    useToast,
} from "@chakra-ui/react";

import { CloseIcon } from "@chakra-ui/icons";

const AdminPage = () => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(true);

    const isAdmin = async () => {
        const response = await fetch(`${baseUrl}/auth/admin`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        setLoading(false);
        if (!response.ok) {
            navigate('/');
        }
    }

    const baseUrl = (process.env.REACT_APP_AUTH_SERVICE_ENDPOINT);
    useEffect(() => {
        isAdmin();
    }, []);

    return isLoading ? <Text>Loading</Text> : <AdminPageView />
}

const AdminPageView = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const [locations, setLocations] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [newLocation, setNewLocation] = useState({
        Title: "",
        Description: "",
        city: "",
        street_address: "",
        postcode: "",
        lat: 0,
        lon: 0,
        spaces_available: 0,
        total_spaces: 0,
    });

    // Load locations when the page is loaded
    useEffect(() => {
        loadLocations();
    }, []);

    // Fetch locations from the server
    const loadLocations = async () => {
        try {
            const baseUrl = process.env.REACT_APP_LOCATION_SERVICE_ENDPOINT;
            const response = await fetch(`${baseUrl}/location/parking-locations-all`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await response.json();
            setLocations(data);
        }
        catch (error) {
            toast({
                title: error.message ?? "Failed to add location.",
                status: "error",
                duration: 2000,
                isClosable: true,
            });
        }
    };

    // Add a new location
    const addLocation = async (location) => {

        const { Title, Description, city, street_address, postcode,
            lat, lon, total_spaces } = location;

        console.log(JSON.stringify({
            Title: Title,
            Description: Description,
            city: city,
            street_address: street_address,
            postcode: postcode,
            lat: lat,
            lon: lon,
            total_spaces: total_spaces,
            spaces_available: total_spaces,
        }));
        const baseUrl = process.env.REACT_APP_LOCATION_SERVICE_ENDPOINT;


        try {
            const response = await fetch(`${baseUrl}/location/parking-locations`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    Title: Title,
                    Description: Description,
                    city: city,
                    street_address: street_address,
                    postcode: postcode,
                    lat: lat,
                    lon: lon,
                    total_spaces: total_spaces,
                    spaces_available: total_spaces,
                }),
            });
            if (!response.ok) {
                throw new Error("Failed to add location");
            }
            setNewLocation({
                Title: "",
                Description: "",
                city: "",
                street_address: "",
                postcode: "",
                lat: 0,
                lon: 0,
                spaces_available: 0,
                total_spaces: 0,
            });
            toast({
                title: "Added new location.",
                status: "success",
                duration: 2000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: error.message ?? "Failed to add location.",
                status: "error",
                duration: 2000,
                isClosable: true,
            });
        }
        loadLocations();
        onClose();
    };

    // Delete a location
    const deleteLocation = async (id) => {
        try {
            const baseUrl = process.env.REACT_APP_LOCATION_SERVICE_ENDPOINT;
            const response = await fetch(`${baseUrl}/location/parking-locations/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to delete location");
            }
            setLocations((prevLocations) =>
                prevLocations.filter(
                    (location) => location._id !== id
                )
            );
            toast({
                title: "Location deleted.",
                status: "success",
                duration: 2000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Failed to delete location.",
                status: "error",
                duration: 2000,
                isClosable: true,
            });
        }
        loadLocations();
    };

    return (
        <Box>
            <Box bg="gray.100" py="4" px="2" textAlign="center">
                <Heading as="h1" size="xl">
                    Admin Panel
                </Heading>
                <Button onClick={() => {
                    localStorage.removeItem('token');
                    navigate("/");
                }}>
                    Sign Out
                </Button>
            </Box>
            <br />
            <Container p={4} align={"center"} borderWidth={1} >
                <VStack spacing="6">
                    <Box w="100%">
                        <Text fontSize="2xl" fontWeight="semibold">
                            Location Management
                        </Text>
                        <Button colorScheme="blue" size="sm" onClick={onOpen}>
                            Add New Location
                        </Button>
                    </Box>
                    <Box minW={"50vw"}>
                        {locations.map((location) => (
                            <Box
                                key={`parent${location._id}`}
                                py={1}>
                                <Box
                                    key={location._id}
                                    p={4}
                                    display={"flex"}
                                    flexDir={"row"}
                                    justifyContent={"space-between"}
                                    borderWidth={1}
                                    borderRadius={4}
                                >
                                    <div>
                                        <Text mr={4} fontSize={18}>
                                            <strong></strong>
                                            <strong>Title:</strong> {location.Title}
                                        </Text>
                                        <Text flex="1">
                                            <strong>Description:</strong> {location.Description}
                                        </Text>
                                        <Text flex="1">
                                            <strong>Address:</strong> {location.street_address}
                                        </Text>
                                        <Text flex="1">
                                            <strong>Postcode:</strong> {location.postcode}
                                        </Text>
                                        <Text flex="1">
                                            <strong>Total Spaces:</strong> {location.spaces_available}
                                        </Text>
                                        <Text flex="1">
                                            <strong>Total Spaces:</strong> {location.total_spaces}
                                        </Text>
                                    </div>
                                    <Button
                                        key={`delete:${location._id}`}
                                        rightIcon={<CloseIcon />}
                                        aria-label="Delete location"
                                        onClick={() => deleteLocation(location._id)}
                                    >
                                        Delete
                                    </Button>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </VStack>
            </Container>

            <Modal
                isOpen={isOpen}
                onClose={onClose}
                size="md"
                closeOnOverlayClick={false}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add Location / Parking Area</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing="4">
                            <FormControl id="Title">
                                <FormLabel>Title</FormLabel>
                                <Input
                                    type="text"
                                    value={newLocation.Title}
                                    onChange={(e) =>
                                        setNewLocation({ ...newLocation, Title: e.target.value })
                                    }
                                />
                            </FormControl>
                            <FormControl id="Description">
                                <FormLabel>Description</FormLabel>
                                <Input
                                    type="text"
                                    value={newLocation.Description}
                                    onChange={(e) =>
                                        setNewLocation({ ...newLocation, Description: e.target.value })
                                    }
                                />
                            </FormControl>
                            <FormControl id="city">
                                <FormLabel>City</FormLabel>
                                <Input
                                    type="text"
                                    value={newLocation.city}
                                    onChange={(e) =>
                                        setNewLocation({ ...newLocation, city: e.target.value })
                                    }
                                />
                            </FormControl>
                            <FormControl id="street_address">
                                <FormLabel>Street Address</FormLabel>
                                <Input
                                    type="text"
                                    value={newLocation.street_address}
                                    onChange={(e) =>
                                        setNewLocation({ ...newLocation, street_address: e.target.value })
                                    }
                                />
                            </FormControl>
                            <FormControl id="postcode">
                                <FormLabel>Postcode</FormLabel>
                                <Input
                                    type="text"
                                    value={newLocation.postcode}
                                    onChange={(e) =>
                                        setNewLocation({ ...newLocation, postcode: e.target.value })
                                    }
                                />
                            </FormControl>
                            <FormControl id="lat">
                                <FormLabel>Latitude</FormLabel>
                                <Input
                                    type="number"
                                    step="0.000001"
                                    value={newLocation.lat}
                                    onChange={(e) =>
                                        setNewLocation({
                                            ...newLocation,
                                            lat: parseFloat(e.target.value),
                                        })
                                    }
                                />
                            </FormControl>
                            <FormControl id="lon">
                                <FormLabel>Longitude</FormLabel>
                                <Input
                                    type="number"
                                    step="0.000001"
                                    value={newLocation.lon}
                                    onChange={(e) =>
                                        setNewLocation({
                                            ...newLocation,
                                            lon: parseFloat(e.target.value),
                                        })
                                    }
                                />
                            </FormControl>
                            <FormControl id="total_spaces">
                                <FormLabel>Total Spaces</FormLabel>
                                <NumberInput
                                    value={newLocation.total_spaces}
                                    onChange={(value) => {
                                        const intValue = parseInt(value);
                                        if (!isNaN(intValue) && intValue > 0) {
                                            setNewLocation({
                                                ...newLocation,
                                                total_spaces: intValue,
                                            });
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
                            </FormControl>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr="2" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme="blue" onClick={() => addLocation(newLocation)}>
                            Add Location
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default AdminPage;