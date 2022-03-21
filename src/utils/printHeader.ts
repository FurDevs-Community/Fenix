import FenixClient from "../lib/FenixClient";
import { __production__ } from "./constants";

export const printHeader = async (client: FenixClient) => {
    console.log("######################################################");
    console.log("         888'Y88                 ,e,                  ");
    console.log("         888 ,'Y  ,e e,  888 8e   \"   Y8b Y8Y         ");
    console.log("         888C8   d88 88b 888 88b 888   Y8b Y          ");
    console.log("         888 \"   888   , 888 888 888  e Y8b           ");
    console.log("         888      \"YeeP\" 888 888 888 d8b Y8b          ");
    console.log("######################################################");
    console.log(`🚀 Running Version: ${require("../../package.json").version}`);
    console.log(
        `🧰 Enviroment: ${__production__ ? "Production" : "Development"}`
    );
    console.log("######################################################");
};
