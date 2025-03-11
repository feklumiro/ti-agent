'use strict';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'COUNT') {
    console.log(`Current count is ${request.payload.count}`);
  }
  sendResponse({});
  return true;
});


function checkStatus(vt=null, kp=null){
  var tr = 0;
  if (vt){
    if (vt.rait <= -25) tr -= 70;
    else if (vt.rait <= 10) tr -= 55;
    else if (vt.rait <= -1) tr -= 20;
    else tr += 30; 
  }
  if (kp){
    if (kp.zone == "Red") tr -= 120;
    if (kp.zone == "Orange") tr -= 80;
    if (kp.zone == "Yellow") tr -= 10;
    if (kp.zone == "Green") tr += 10;
  }

  let st = "";
  if (tr <= 70) {
    st = "Dangerous";
    
  }
  else if (tr <= 40) st = "Malicious";
  else if (tr <= 10) st = "Not safe";
  else st = "Safe";
  
  return {rait: tr, status: st}
}

(async () => {
  const domain = window.location.hostname;
  var p = 0;
  var zn = "";

  // VIRUSTOTAL API
  chrome.runtime.sendMessage({ action: "fetchData", req: "VT", domain: domain }, (response) => {
    if (response.success) {
      const vt = response.json['data']['attributes']['total_votes'];
      const lt = response.json['data']['attributes']['last_analysis_stats'];
      p = vt['harmless']*3 - vt['malicious'] - lt['malicious']*5;
      console.log(`Raiting from VirusTotal for domain ${domain}: ${p}`);
    } else {
      console.error("api err:", response.error);
    }
  });

  // KASPERSKY API
  chrome.runtime.sendMessage({ action: "fetchData", req: "KP", domain: domain }, (response) => {
    if (response.success) {
      zn = response.json['Zone'];
      console.log(`${zn} zone`);
      if (response.json['DomainGeneralInfo'].hasOwnProperty('CategoriesWithZone')){
        response.json['DomainGeneralInfo']['CategoriesWithZone'].forEach((el) => {
          if (el['Zone'] == 'Red'){
            console.log(el['Name']);
          }
        });
      }
    } else {
      console.error("api err:", response.error);
    }
    if(confirm(`${p}, ${zn}`)) history.back();
  });

})();

