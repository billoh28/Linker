chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message["action"] == "extractData") {
        let result  = await extractDataFromJobPage();
        sendResponse(result);
    } else if (message["action"] == "queryData") {
        var key = "";
        if (document.URL.match("currentJobId=")) {
            key = document.URL.split("currentJobId=")[1];
        }
        else {
            key = document.URL.split("/")[5];
        }
        sendResponse(key);
    }
});

function extractTextQuery(xpath) {
    let temp = document.querySelector(xpath);
    if (temp !== null) {
        return temp.innerText;
    }
    return "";
}

function extractTextQueryToArr(xpath) {
    var queryList = document.querySelectorAll(xpath);
    var resultArr = new Array();
    for(var i = 0; i < queryList.length; i++) {
        resultArr.push(queryList[i].innerText)
    }
    return resultArr;
}

async function extractDataFromJobPage() {
    var company = extractTextQuery("div.job-details-jobs-unified-top-card__company-name");
    var title = extractTextQuery("h1[class='t-24 t-bold inline']");
    var loc = "";
    var posted = "";
    var applicants = "";
    var level = "";
    var jobDetails = "";

    // Get Location, date posted and number of applicants
    let info = document.getElementsByClassName("t-black--light mt2 job-details-jobs-unified-top-card__tertiary-description-container");
    if (info !== null && info.length > 0) {
        let children = info[0].getElementsByClassName("tvm__text tvm__text--low-emphasis");

        if (children.length == 5) {
            if (children[0] !== null) loc = children[0].innerText;
            if (children[2] !== null) posted = children[2].innerText;
            if (children[4] !== null) applicants = children[4].innerText;
        }
    }

    // Get job description
    if (document.getElementById('job-details') !== null) {
        var jobDetails = document.getElementById('job-details').innerText;
    }

    // Get linkedin job id
    var key = "";
    if (document.URL.match("currentJobId=")) {
        key = document.URL.split("currentJobId=")[1];
    }
    else {
        key = document.URL.split("/")[5];
    }

    // Get extra posting info
    var postingInfoArr = extractTextQueryToArr("li.job-details-jobs-unified-top-card__job-insight.job-details-jobs-unified-top-card__job-insight--highlight span[aria-hidden='true']");

    // Get posting experience level
    var extraInfo = document.querySelectorAll("li.job-details-jobs-unified-top-card__job-insight.job-details-jobs-unified-top-card__job-insight--highlight span[class='job-details-jobs-unified-top-card__job-insight-view-model-secondary']")
    if (extraInfo.length > 0 && !extraInfo[extraInfo.length - 1].innerText.includes("Full-time")) {
        level = extraInfo[extraInfo.length - 1].innerText;
    }

    var data = {
        jobId: key,
        company: company,
        title: title,
        location: loc,
        posted: posted,
        applicants: applicants,
        level: level,
        postingInfo: postingInfoArr,
        jobDetails: jobDetails,
        dateSaved: (new Date()).toISOString().slice(0,10)
    }
    
    return data;
}
