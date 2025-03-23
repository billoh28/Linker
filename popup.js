document.getElementById('fetchJobs').addEventListener('click', fetchJobs);

function fetchJobs() {
    var ul = document.getElementById("jobs-list");
    ul.innerHTML = "";

    chrome.storage.local.getKeys((keys) => {
        for (var i = 0; i < keys.length; i++) {
            var li = document.createElement('li');
            li.setAttribute('id', keys[i]);
            ul.appendChild(li);
            queryData(keys[i]);
        }
    });
}

function queryData(jobId) {
    return chrome.storage.local.get([jobId], function(result) {
        console.log(result[jobId].title);
        var title = new String(result[jobId].title);
        var li = document.getElementById(jobId);
        li.innerText = title;
    });
}
