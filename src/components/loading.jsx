import { Flex } from "@chakra-ui/react";
import React from "react";
import Lottie from "lottie-react";
import loading from "../img/loading2.json"

import "./styles/loading.css"

// This component show a "sending" animation
// with css styles, it takes the whole page with a semi opaque background (bit like a modal)


const Loading = () => {
    return (
        <Flex
            justifyContent={"center"}
            alignItems={"center"}
            flexDirection={"column"}
            height={"full"}
            px={10}
            className="upload-anim"
        >
            <Lottie animationData={loading} height="80px" width={"80px"}/>

            <span>UPLOADING</span>
        </Flex>
    );
};

export default Loading;