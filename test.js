setInterval(() => {
    function handle() {
        if (result) {
            inputElements.forEach((e, i) => {
                e.value = result[i];
            });
        }
    }

    async function callApi(link) {
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
        } else {
            resolve();
        }
    }

    const getNextInputElement = () => {
        i++;
        if (i >= inputElements.length - 4) {
            btn[1].click();
            handle();
            return false;
        } else return links[i];
    };

    const inputElements = document.querySelectorAll("input");
    let btn = document.querySelectorAll("button");
    btn[1].click();
    var i = 0;
    let links = [];
    let result = [];

    const startAsyncProcess = () => {
        return new Promise(async (resolve, reject) => {
            inputElements.forEach((e) => {
                const BackgroundImage =
                    getComputedStyle(e).getPropertyValue("background-image");
                let match = BackgroundImage.match(/"([^"]+)"/);
                if (match) {
                    let link = match[1];
                    links.push(link);
                }
            });

            await callApi(links[0]);
            resolve();
        });
    };

    setTimeout(() => {
        startAsyncProcess()
            .then(() => {
                btn[0].click();
            })
            .catch((error) => {
                console.error("Lỗi trong quá trình xử lý bất đồng bộ:", error);
            });
    }, 500);
}, 65000);
