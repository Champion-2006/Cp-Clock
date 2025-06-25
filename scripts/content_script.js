let isProblemPage = window.location.href.includes("/problem/");

let sidebar = document.querySelector("#sidebar");
let second = document.querySelector(".roundbox.sidebox.ContestVirtualFrame");

let timeWindow = document.createElement("div");
timeWindow.classList.add("timer");
timeWindow.style.display = "none";

let heading = document.createElement("div");
heading.classList.add("heading");
heading.textContent = "Time Left";
timeWindow.appendChild(heading);

let time = document.createElement("div");
time.classList.add("runner");
timeWindow.appendChild(time);

function createTimeBlock(value, label) 
{
    let block = document.createElement("span");
    block.classList.add("spaan");

    let valueNode = document.createElement("div");
    valueNode.textContent = value;
    valueNode.classList.add(label);

    let labelNode = document.createElement("div");
    labelNode.textContent = label;
    labelNode.classList.add("spaan-label");

    block.appendChild(valueNode);
    block.appendChild(labelNode);
    return block;
}

time.appendChild(createTimeBlock("00", "Hours"));
time.appendChild(createTimeBlock("00", "Minutes"));
time.appendChild(createTimeBlock("00", "Seconds"));

if (sidebar && second && isProblemPage) 
{
    sidebar.insertBefore(timeWindow, second);
    timeWindow.style.display = "block"; 
} 
else 
{
    document.body.appendChild(timeWindow); 
}


let Hourele = document.querySelector(".Hours");
let Minuteele = document.querySelector(".Minutes");
let Secondele = document.querySelector(".Seconds");

let hours = 0;
let minutes = 0;
let seconds = 0;
let timerId = null;

chrome.storage.local.get(["total"], (result) => 
{
    if (result.total && result.total > 0) 
    {
        let total = result.total;
        let hr = Math.floor(total / 3600);
        let min = Math.floor((total % 3600) / 60);
        let sec = total % 60;

        doStuff(hr, min, sec , 0);
    }
});
function Clear(timerId)
{
    if(timerId != null)  clearInterval(timerId);
    timerId = null;
    chrome.storage.local.remove("total");
}
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "HR")
    {
        hours = parseInt(message.value) || 0;
        Clear(timerId);
        let value = hours * 3600 + minutes * 60 + seconds;
        chrome.storage.local.set({total : value});
    } 
    else if (message.type === "MIN") 
    {
        minutes = parseInt(message.value) || 0;
        Clear(timerId);
        let value = hours * 3600 + minutes * 60 + seconds;
        chrome.storage.local.set({total : value});
    } 
    else if (message.type === "SEC") 
    {
        seconds = parseInt(message.value) || 0;
        let value = hours * 3600 + minutes * 60 + seconds;
        Clear(timerId);
        chrome.storage.local.set({total : value});
    }
    if(message.type == "start")
    {
        chrome.storage.local.get(["total"] , (result) =>
        {
            let curTime = result.total;
            let hr = Math.floor(curTime / 3600);
            let min = Math.floor((curTime % 3600) / 60);
            let sec = curTime % 60;
            doStuff(hr,min,sec,0);
        });
    }
    else if(message.type == "reset")
    {
        chrome.storage.local.set({hr : "0" , min : "0" , sec : "0"});
        doStuff(0,0,0,1);
    }
    else if(message.type == "stop")
    {
        if(timerId != null)
        {
            clearInterval(timerId);
            timerId = null;
        }
    }
});

function doStuff(hr,min,sec,byReset)
{
    if (timerId !== null) 
    {
        clearInterval(timerId);
        timerId = null;
    }

    hours = hr , minutes =  min , seconds =  sec;
    
    let totalSeconds = hours * 60 * 60 + minutes * 60 + seconds;

    updateTimer();

    chrome.storage.local.get(["total"] , (result) => 
    {
        if(result.total) totalSeconds = result.total;
        else 
        {
            try
            {
                chrome.storage.local.set({ total: totalSeconds });
            }
            catch(err)
            {
                console.log("Error Occured : ",err);
            }
        }
        timerId = setInterval(updateTimer , 1000);
    });
    function updateTimer() 
    {
        if (totalSeconds < 0) 
        {
            clearInterval(timerId);
            if(!byReset) alert("Time's Up");
            timerId = null;
            return;
        }

        let curSeconds = totalSeconds % 60;
        let curHour = Math.floor(totalSeconds / 3600);
        let curMinutes = Math.floor((totalSeconds % 3600) / 60);

        Hourele.textContent = (curHour < 10 ? "0" : "") + curHour;
        Minuteele.textContent = (curMinutes < 10 ? "0" : "") + curMinutes;
        Secondele.textContent = (curSeconds < 10 ? "0" : "") + curSeconds;

        totalSeconds--;
        try
        {
            chrome.storage.local.set({ total: totalSeconds });
        }
        catch(err)
        {
            console.log("Error Occured : ",err);    
        }
    }
}
