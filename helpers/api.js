// import dotenv
import dotenv from 'dotenv';
dotenv.config();
import fetch from "node-fetch";

async function getApi() {

    const apiKey = process.env.API_KEY || "YOUR_API_KEY";
    const stationCode = "EKZ"; // replace with your desired station code

    try {
        console.log("fetching...")
        const response = await fetch(`https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/departures?station=${stationCode}`, {
            headers: {
              "Ocp-Apim-Subscription-Key": apiKey
            }
          })
        const data = await response.json();
        
        const resizedData = data.payload.departures[0];

        console.log("fetching finished")
        return resizedData;
    }catch(err) {
        console.log('error fetching api' + err );
    }

}

export default {
    getApi
}