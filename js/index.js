(async () => {

    document.getElementById('inputPostURL').addEventListener('submit', async (event) => {
        event.preventDefault();
        generate();
    });

    document.getElementById("generateButton").addEventListener("click", function () {
        generate();
    });

    document.getElementById("exampleButton").addEventListener("click", function () {
        randomExample();
        generate();
    });

    async function generate() {
        var url = document.getElementById("postURL").value;

        if (url.startsWith("https://www.producthunt.com/posts/")) {
            var s = url.substring('https://www.producthunt.com/posts/'.length);
            var n = s.indexOf('/');
            s = s.substring(0, n != -1 ? n : s.length);
            var id = await getPostID(s);
            if (!id.error) {
                var votesResp = await getVotes(id);
                if (votesResp.votes) {

                    var sectionURL = document.getElementById("sectionURL");
                    sectionURL.className = "section";

                    var sectionBadge = document.getElementById("sectionBadge");
                    sectionBadge.className = "section";

                    var sectionDone = document.getElementById("sectionDone");
                    sectionDone.className = "section";

                    var output = document.getElementById("outputURL");
                    output.value = `https://api.phkit.me/votes/${id}`;

                    var name = document.getElementById("getName");
                    name.textContent = "votes: "

                    var result = document.getElementById("getResult");
                    result.textContent = votesResp.votes;

                    var githubBadge = document.getElementById("githubBadge");
                    githubBadge.src = `https://img.shields.io/badge/Upvotes-${votesResp.votes}-DA552E.svg?logo=product-hunt&logoColor=fff&color=DA552E`

                    var githubBadgeInput = document.getElementById("githubBadgeInput");
                    githubBadgeInput.value = `https://img.shields.io/badge/dynamic/json.svg?label=Upvotes&query=%24.votes&url=https%3A%2F%2Fapi.phkit.me%2Fvotes%2F${id}&logo=product-hunt&&logoColor=fff&color=DA552E&`

                    var socialBadge = document.getElementById("socialBadge");
                    socialBadge.src = `https://img.shields.io/badge/Upvotes-${votesResp.votes}-DA552E.svg?logo=product-hunt&logoColor=DA552E&style=social`

                    var socialBadgeInput = document.getElementById("socialBadgeInput");
                    socialBadgeInput.value = `https://img.shields.io/badge/dynamic/json.svg?label=Upvotes&query=%24.votes&url=https%3A%2F%2Fapi.phkit.me%2Fvotes%2F${id}&logo=product-hunt&logoColor=DA552E&style=social`
                }
            } else {
                alert("Please enter a valid post url");
            }
        } else {
            alert("Please enter a valid post url");
        }
    }

    async function getPostID(name) {
        var response = await fetch(`https://api.phkit.me/getPostID/${name}`);
        var response = await response.json();
        return response;
    }

    async function getVotes(id) {
        var response = await fetch(`https://api.phkit.me/votes/${id}`);
        var response = await response.json();
        return response;
    }

    async function getStars() {
        var response = await fetch(`https://api.github.com/repos/ajzbc/phkit.me`);
        var response = await response.json();
        return response.stargazers_count;
    }

    var phkitUpvotes = await getVotes("146467");
    document.getElementById("phkitUpvotes").innerHTML = phkitUpvotes.votes;

    var phkitStars = await getStars();
    document.getElementById("phkitStars").innerHTML = phkitStars;

})();

function copy(id) {
    const copy = document.createElement('textarea');
    copy.value = document.getElementById(id).value;
    document.body.appendChild(copy);
    copy.select();
    document.execCommand('copy');
    document.body.removeChild(copy);
}

function randomExample() {
    var example = ["https://www.producthunt.com/posts/slack", "https://www.producthunt.com/posts/startup-stash", "https://www.producthunt.com/posts/station-3", "https://www.producthunt.com/posts/f-lux", "https://www.producthunt.com/posts/notion-2-0", "https://www.producthunt.com/posts/sublime-text-3-0", "https://www.producthunt.com/posts/polymail-2", "https://www.producthunt.com/posts/firefox-quantum"];
    var index = Math.floor(Math.random() * (example.length + 1));
    document.getElementById("postURL").value = example[index];
}