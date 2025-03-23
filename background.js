chrome.contextMenus.onClicked.addListener(onClick);

function onClick(info) {
    if (info.menuItemId == "extractData") {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            let pattern = "https://www.linkedin.com/jobs/";
            if (tabs[0].url.startsWith(pattern)) {
                chrome.tabs.sendMessage(tabs[0].id, {action: "extractData"}, function(data) { storeData(data) }); 
            } 
        });
    } else if (info.menuItemId == "queryData") {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            let pattern = "https://www.linkedin.com/jobs/";
            if (tabs[0].url.startsWith(pattern)) {
                chrome.tabs.sendMessage(tabs[0].id, {action: "queryData"}, function(data) { queryData(data) });
            } 
        });
    }
}

chrome.runtime.onInstalled.addListener(function () {
    let extract = chrome.contextMenus.create({
        title: 'Save job',
        id: 'extractData'
    });

    let query = chrome.contextMenus.create({
        title: 'Query if job saved',
        id: 'queryData'
    });
});

function storeData(data) {
    var t = data["jobId"];
    chrome.storage.local.set({[t] : data}, function() {
        alert("Job info saved")
      });
}

function queryData(jobId) {
    chrome.storage.local.get([jobId], function(result) {
        if (result[jobId] !== undefined) {
            alert("Job " + result[jobId].title + " saved before on " + result[jobId].dateSaved);
        } else {
            alert("No record of this job found");
        }
      });
}

