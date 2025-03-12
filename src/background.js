'use strict';


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchData") {
    if (request.req == "VT"){
      const vt_url = `https://www.virustotal.com/api/v3/domains/${request.domain}`;

      const vt_options = {
        method: 'GET', 
        mode: "cors",
        headers: {
          accept: 'application/json',
          'x-apikey': process.env.VT_APIKEY
      }};

      fetch(vt_url, vt_options)
        .then(response => response.json())
        .then(data => sendResponse({ success: true, json: data }))
        .catch(error => sendResponse({ success: false, error: error.message }));
    }
    else if (request.req == "KP"){
      const kp_options = {
        method: 'GET', 
        mode: 'cors',
        headers: {
            accept: 'application/json',
            'x-api-key': process.env.KP_APIKEY
      }}
      const kp_url = `https://opentip.kaspersky.com/api/v1/search/domain?request=${request.domain}`
      fetch(kp_url, kp_options)
        .then(response => response.json())
        .then(data => sendResponse({ success: true, json: data }))
        .catch(error => sendResponse({ success: false, error: error.message }));
    }
    
    return true;
  }
});
