import {base64Encode} from "../functions";
import apiService from "./index";

export const razorPayApiService = (apilink: string, apikey: string, apisecret: string, requestData: {
    action?: string,
    querySting?: any,
    body?: any,
    method?: any
}) => {

    let authKey = base64Encode(`${apikey}:${apisecret}`)

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Basic ${authKey}`);
    myHeaders.append("User-Agent", `PostmanRuntime/7.36.0`);
    myHeaders.append("Access-Control-Allow-Origin", '*');
    myHeaders.append("Access-Control-Allow-Headers", 'Access-Control-Allow-Methods, Access-Control-Allow-Origin, Origin, Accept, Content-Type');
    myHeaders.append("Origin", 'https://account.dhru.com');
    myHeaders.append("Referer", 'https://account.dhru.com/');

    var raw = JSON.stringify({
        "amount": 1000,
        "currency": "INR",
        "accept_partial": false,
        "expire_by": 1691097057,
        "reference_id": "TSsd1989",
        "description": "Payment for policy no #23456",
        "customer": {
            "name": "Gaurav Kumar",
            "contact": "+919000090000",
            "email": "gaurav.kumar@example.com"
        },
        "notify": {
            "sms": true,
            "email": true
        },
        "reminder_enable": true,
        "notes": {
            "policy_name": "Jeevan Bima"
        },
        "callback_url": "https://example-callback-url.com/",
        "callback_method": "get"
    });

    var requestOptions:any = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("https://api.razorpay.com/v1/payment_links", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));




    //
    //
    // console.log(authKey)
    // return apiService({
    //     action     : requestData.action,
    //     method     : requestData.method,
    //     body       : requestData.body,
    //     queryString: requestData.querySting,
    //     headers    : myHeaders,
    //     externalApi: `https://${apilink}`
    // })
}
