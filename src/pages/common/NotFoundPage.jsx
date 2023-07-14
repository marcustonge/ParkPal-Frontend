import React from "react";
import { Flex, Image, Heading, Stack, Text, Button } from "@chakra-ui/react"
import { NavLink } from "react-router-dom";

const NotFoundPage = () => {
    return (<Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={'gray.50'}>

            <Stack textAlign={'center'} spacing={8}>
                <Image src="/images/page_not_found.svg" maxHeight={200}>


                </Image>

                <Heading > Page Not Found </Heading>

                <Text fontSize={'lg'} color={'gray.600'}>We are unable to find the page you are looking for!</Text>

                <Button as={NavLink} to='/'>Press here to return home</Button>
            </Stack>



        </Flex>);
}

export default NotFoundPage;