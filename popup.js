document.getElementById('fetchJobs').addEventListener('click', fetchJobs);

function fetchJobs() {
    var tbody = document.getElementById("jobs-rows");
    tbody.innerHTML = "";

    chrome.storage.local.getKeys((keys) => {
        for (var i = 0; i < keys.length; i++) {
            var tr = document.createElement('tr');
            tr.setAttribute('id', keys[i]);
            tbody.appendChild(tr);

            applyFunctionToJobValue(keys[i], function(result) {
                let key = Object.keys(result)[0];
                var tr = document.getElementById(key);
                tr.innerHTML = convertJobObjToLiHTML(result[key]);
            });
        }
    });
}

function applyFunctionToJobValue(jobId, func) {
    chrome.storage.local.get([jobId], func);
}

function convertJobObjToLiHTML(jobObj) {
    let titleField = '<td>' + jobObj.title + '</td>';
    let companyField = '<td>' + jobObj.company + '</td>';
    let locationField = '<td>' + jobObj.location + '</td>';
    let dateSaved = '<td>' + jobObj.dateSaved + '</td>';
    let appliedCheckbox = '<td><input type="checkbox" id="applied-checkbox-' + jobObj.jobId + '"></td>';
    let rejectedCheckbox = '<td><input type="checkbox" id="rejected-checkbox-' + jobObj.jobId + '"></td>';

    return titleField + companyField + locationField + dateSaved + appliedCheckbox + rejectedCheckbox;
}
