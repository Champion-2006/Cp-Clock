let selectHr = document.querySelector("#hr");
let selectMin = document.querySelector("#min");
let selectSec = document.querySelector("#sec");
let startbtn = document.querySelector(".start");
let stopbtn = document.querySelector(".stop");
let resetbtn = document.querySelector(".reset");
function add(parent , value)
{
    for(let i=0;i<=value;i++)
    {
        let Opt = document.createElement("option");
        Opt.value = i;
        Opt.textContent = (i < 10) ? "0" + i : i;
        parent.appendChild(Opt);
    }
}
add(selectHr , 12);
add(selectMin , 60);
add(selectSec , 60);

selectHr.addEventListener("change" , ()=>
{
    let value = selectHr.value;
    chrome.tabs.query({active : true , currentWindow : true},(tabs) =>
    {
        let tab = tabs[0] , tabId = tab.id;
        chrome.tabs.sendMessage(tabId , {value , type : "HR"});
    });
});
selectMin.addEventListener("change" , ()=>
{
    let value = selectMin.value;
    chrome.tabs.query({active : true , currentWindow : true},(tabs) =>
    {
        let tab = tabs[0] , tabId = tab.id;
        chrome.tabs.sendMessage(tabId , {value , type : "MIN"});
    });
});
selectSec.addEventListener("change" , ()=>
{
    let value = selectSec.value;
    chrome.tabs.query({active : true , currentWindow : true},(tabs) =>
    {
        let tab = tabs[0] , tabId = tab.id;
        chrome.tabs.sendMessage(tabId , {value , type : "SEC"});
    });
});

startbtn.addEventListener("click",()=>
{
    chrome.tabs.query({active : true , currentWindow : true},(tabs) =>
    {
        let tab = tabs[0] , tabId = tab.id;
        chrome.tabs.sendMessage(tabId , {type : "start"});
    });
});   
resetbtn.addEventListener("click",()=>
{
    chrome.tabs.query({active : true , currentWindow : true},(tabs) =>
    {
        let tab = tabs[0] , tabId = tab.id;
        chrome.tabs.sendMessage(tabId , {type : "reset"});
    });
});   
stopbtn.addEventListener("click",()=>
{
    chrome.tabs.query({active : true , currentWindow : true},(tabs) =>
    {
        let tab = tabs[0] , tabId = tab.id;
        chrome.tabs.sendMessage(tabId , {type : "stop"});
    });
});     