setInterval(() => {
    function handle() {
        if (result) {
            inputElements.forEach((e, i) => {
                e.value = result[i];
            });
        }
    }

    async function callApi(link) {
        try {
            const response = await fetch("https://fashion-flavor-fully-framework.trycloudflare.com/", {
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
                // Khi tất cả các cuộc gọi đã hoàn thành, resolve Promise
                resolve();
            }
        } catch (error) {
            console.error("Lỗi:", error);
            // Khi có lỗi, reject Promise
            // reject(error);
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

    function startAsyncProcess() {
        return new Promise(async (resolve, reject) => {
            inputElements.forEach((e) => {
                try {
                    const BackgroundImage =
                        getComputedStyle(e).getPropertyValue(
                            "background-image"
                        );
                    let match = BackgroundImage.match(/"([^"]+)"/);
                    if (match) {
                        let link = match[1];
                        links.push(link);
                    }
                } catch (error) {}
            });

            try {
                await callApi(links[0]);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    setTimeout(() => {
        startAsyncProcess()
            .then(() => {
                // Khi tất cả đã hoàn thành, thực hiện btn[0].click()
                btn[0].click();
            })
            .catch((error) => {
                console.error("Lỗi trong quá trình xử lý bất đồng bộ:", error);
            });
    }, 1500);
}, 65000);
