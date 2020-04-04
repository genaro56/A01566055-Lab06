// GET https://www.googleapis.com/youtube/v3/search

const YOUTUBE_API_KEY = 'AIzaSyC1NPDuGHwRjjhKtelcDkOgJyIIQ63OkqM';
var queryText = document.getElementById("searchInput");
let prevPageVal = '', nextPageVal = '';

let createUrl = (option = 0, searchParam) => {
    let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${searchParam}&key=${YOUTUBE_API_KEY}`
    if (option != 0) {
        url += `&pageToken=${option === 1 ? nextPageVal : prevPageVal}`
    }
    return url;
};

document.getElementById('searchForm').addEventListener('submit', function (e) {
    e.preventDefault();
    console.log(e)
    searchAPI(0);
});


function clearVideos() {
    document.getElementById("videos").innerHTML = "";
    queryText.value = "";
}

function generateVideos({ items, nextPageToken, prevPageToken }) {
    prevPageVal = prevPageToken;
    nextPageVal = nextPageToken;
    document.getElementById("videos").innerHTML = "";
    items.forEach(item => {
        const html = `
            <div  class="container" >
                <a href="https://www.youtube.com/watch?v=${item.id.videoId}">
                <p>${item.snippet.title}<p>
                <img src="${item.snippet.thumbnails.high.url}"></img>
                </a>
            </div>`;
        document.getElementById('videos').insertAdjacentHTML('afterBegin', html);
    });
}

function searchAPI(pageOption = 0) {
    const url = createUrl(pageOption, queryText.value);
    fetch(url).then((res) => {
        if (res.status != 200) {
            console.error('Looks like there was a problem. Status code'
                + res.status);
            return;
        }
        res.json().then((data) => {
            console.log(data.items);
            generateVideos(data);
            const buttons = document.getElementsByClassName('navBtns');
            buttons[0].disabled = prevPageVal === undefined;
            buttons[1].disabled = nextPageVal === undefined;
        })
    });
}