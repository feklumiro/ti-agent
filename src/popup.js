'use strict';

import './popup.css';


(async() => {
  let whiteList = document.getElementById("whiteList")
  whiteList.addEventListener("click", () => {
    if (!whiteList.classList.contains("rm")){
      whiteList.innerText = "➖ Удалить из белого списка"
      whiteList.classList.add("rm")
      whiteList.style.backgroundColor = "#e6c860";
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const currentTab = tabs[0];
        chrome.tabs.sendMessage(currentTab.id, { type: "domain" }, (response) => {
          chrome.storage.sync.get("whiteList", function(data) {
            let upd = data.whiteList || []; 
            upd.push(response.domain);
            chrome.storage.sync.set({ whiteList: upd }, () => {})
          });
        })
      })
    }
    else{
      whiteList.innerText = "➕ Добавить в белый список"
      whiteList.classList.remove("rm")
      whiteList.style.backgroundColor = "lightblue";
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const currentTab = tabs[0];
        chrome.tabs.sendMessage(currentTab.id, { type: "domain" }, (response) => {
          chrome.storage.sync.get("whiteList", function(data) {
            let upd = data.whiteList || []; 
            const ind = upd.indexOf(response.domain);
            if (ind !== -1) upd.splice(ind, 1);
            chrome.storage.sync.set({ whiteList: upd }, () => {})
          });
        })
      })
    }
  })
  let toggleWarnings = document.getElementById("toggleWarnings");
  let toggleVT = document.getElementById("vt");
  let toggleKP = document.getElementById("kp");

  function storageReload() {
    chrome.storage.sync.get(["warningsEnabled", "vt", "kp", "whiteList"], (data) => {
      toggleWarnings.checked = data.warningsEnabled ?? true;
      toggleVT.checked = data.vt ?? true;
      toggleKP.checked = data.kp ?? true;
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const currentTab = tabs[0];
        chrome.tabs.sendMessage(currentTab.id, { type: "domain" }, (response) => {
          data.whiteList = data.whiteList || [];
          if (data.whiteList.includes(response.domain)) {
            whiteList.innerText = "➖ Удалить из белого списка"
            whiteList.classList.add("rm")
            whiteList.style.backgroundColor = "#e6c860";
          }
          else{
            whiteList.innerText = "➕ Добавить в белый список"
            whiteList.classList.remove("rm")
            whiteList.style.backgroundColor = "lightblue";
          }
        })
      })
    });
    function updSettings() {
      chrome.storage.sync.set({
          warningsEnabled: toggleWarnings.checked,
          vt: toggleVT.checked,
          kp: toggleKP.checked
      });
    }
    toggleWarnings.addEventListener("change", updSettings);
    toggleVT.addEventListener("change", updSettings);
    toggleKP.addEventListener("change", updSettings);
  }
  storageReload();
  
  document.addEventListener('DOMContentLoaded', storageReload);
})();
