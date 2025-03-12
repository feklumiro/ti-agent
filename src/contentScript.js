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
    else if (vt.rait <= -10) tr -= 55;
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
  let msg = "";
  if (tr <= -70) {
    st = "Dangerous";
    msg = "ВНИМАНИЕ\nДанная страница классифицирована как Вредоносная"
    if (kp != null && kp.zones.length > 0){
      msg += "\nи помечена меткой "
      if (kp.zones.includes("CATEGORY_MALWARE")){
        msg += "ВРЕДОНОСНОЕ ПО"
        if (kp.zones.includes("CATEGORY_PHISHING")) msg += " и меткой ФИШИНГ"
      }
      else if (kp.zones.includes("CATEGORY_PHISHING")) msg += "ФИШИНГ"
    }
    msg += ".\n"
    msg += "Дальнейшее посещение страницы потенциально опасно.\n"
    msg += 'Настоятельно рекомендуем нажать кнопку "ОК", чтобы покинуть страницу.'
  }
  else if (tr <= -40){
    st = "Malicious";
    msg = "ВНИМАНИЕ\nДанная страница классифицирована как Опасная"
    if (kp != null && kp.zones.length > 0){
      msg += "\nи помечена меткой "
      if (kp.zones.includes("CATEGORY_MALWARE")){
        msg += "ВРЕДОНОСНОЕ ПО"
        if (kp.zones.includes("CATEGORY_PHISHING")) msg += "и меткой ФИШИНГ"
      }
      else if (kp.zones.includes("CATEGORY_PHISHING")) msg += "ФИШИНГ"
    }
    msg += ".\n"
    msg += "Дальнейшее посещение страницы может быть опасно.\n"
    msg += 'Настоятельно рекомендуем нажать кнопку "ОК", чтобы покинуть страницу.'
  }
  else if (tr <= -10){
    st = "Not safe";
    msg = "Домен страницы помечен как Недоверенный.\nБудьте осторожны."
  }
  else{
    st = "Safe";
    msg = "Страница безопасна и не содержит вредоносных объектов"
  }
  
  return {rait: tr, status: st, msg: msg}
}

function alerting(report){
  var st = 0
  if (report.status == "Dangerous" | report.status == "Malicious"){
    if(confirm(report.msg)) history.back();
    else{
      st = 1; 
      report.msg = "Страница содержит вредоносные объекты\nБудьте осторожны."
    }
  }
  var txcolor = ""
  var brcolor = ""
  if (report.status == "Dangerous"){
    txcolor = "#ff0000"
    brcolor = "#c35656"
  }
  else if (report.status == "Malicious"){
    txcolor = "#710052"
    brcolor = "#c76b9a"
  }
  else if (report.status == "Not safe"){
    txcolor = "#000d71"
    brcolor = "#6b7bc7"
  }
  else{
    txcolor = "#0a8b3f"
    brcolor = "#3dc3a4"
  }
  let tsh = document.getElementById("statinfo");
  if (tsh) tsh.remove();
  document.body.insertAdjacentHTML('beforeend', `
    <div id="statinfo" style="background-color: #e9e9e9;border-color: ${brcolor};border-style: solid;color: ${txcolor};font-family: 'Segoe UI';font-size: 14px;position: fixed;left: 2px;bottom: 50px;width: 300px;padding: 14px;z-index: 999; white-space: pre-wrap">
      ${report.msg.trim()}
    </div>
  `);
  console.log(report.status);
  return (st)
}

(async () => {
  const domain = window.location.hostname;
  var p = 0;
  var zn = "";
  var vt={rait: 0};
  var kp={zone: "", zones: []};

  // VIRUSTOTAL API
  chrome.runtime.sendMessage({ action: "fetchData", req: "VT", domain: domain }, (response) => {
    if (response.success) {
      const tt = response.json['data']['attributes']['total_votes'];
      const lt = response.json['data']['attributes']['last_analysis_stats'];
      p = tt['harmless']*3 - tt['malicious'] - lt['malicious']*5;
      console.log(`Vt raiting ${domain}: ${p}`);
    } else {
      console.error("api err:", response.error);
    }
    vt.rait = p
    console.log(alerting(checkStatus(vt,kp)));
  });

  // KASPERSKY API
  chrome.runtime.sendMessage({ action: "fetchData", req: "KP", domain: domain }, (response) => {
    if (response.success) {
      zn = response.json['Zone'];
      kp.zone = zn;
      console.log(`${zn} zone`);
      if (response.json['DomainGeneralInfo'].hasOwnProperty('CategoriesWithZone')){
        response.json['DomainGeneralInfo']['CategoriesWithZone'].forEach((el) => {
          if (el['Zone'] == 'Red' | el['Zone'] == 'Orange'){
            console.log(el['Name']);
            kp.zones.push(el['Name'])
          }
        });
      }
    } else {
      console.error("api err:", response.error);
    }
    console.log(alerting(checkStatus(vt,kp)));
  });

})();

