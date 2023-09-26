function handle() {
    if (result) {
        inputElements.forEach((e, i) => {
            e.value = result[i];
        });
    }
}

async function callApi(link) {
    try {
        const response = await fetch("http://localhost:3285/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ link: link }),
        });

        if (!response.ok) {
            throw new Error("Lỗi mạng hoặc lỗi server");
        }

        const data = await response.json();
        inputElements[i].value = data;
        result.push(data);
        const nextElement = getNextInputElement();
        if (nextElement) {
            await callApi(nextElement);
        }
    } catch (error) {
        console.error("Lỗi:", error);
    }
}

function getNextInputElement() {
    i++;
    if (i >= inputElements.length - 4) {
        btn[1].click();
        handle();
        return false;
    } else return links[i];
}

const inputElements = document.querySelectorAll("input");
let btn = document.querySelectorAll("button");
btn[1].click();
var i = 0;
let links = [];
let result = [];
setTimeout(() => {
    inputElements.forEach((e) => {
        try {
            const BackgroundImage =
                getComputedStyle(e).getPropertyValue("background-image");
            let match = BackgroundImage.match(/"([^"]+)"/);
            if (match) {
                let link = match[1];
                links.push(link);
            }
        } catch (error) {}
    });
    callApi(links[0]);
}, 500);
