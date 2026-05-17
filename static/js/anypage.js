// ==================== Umami Stats 请求 ====================
        (async () => {
            const webid = "ae6cd64c-5900-49c9-9c22-95cedc24a508";
            const statsEndpoint = "https://umami.iletter.top/api/websites/" + webid + "/stats";
            const startAt = 1768060800000;
            const endAt = Date.now(); // 当前时间的时间戳（毫秒）
            const headers = {
                Authorization:
                    "Bearer JMQBYQLIlwUsx1tnfYI35APN3bh75JrdpWkx1uk0LJTi6QEGPlno2W2D7j8ogCAS12pXTT36VAZaGw3Pqgiw3BEViZG7o3+93zcmR4Txm0wjmHsTnig7GAxWfQMs1eRY9ACFl9KAo2n0UNgC+CqZt64PFxsKwsaIE2UzuGq1ByrCW8TQwtf76ZHg/qYYjFKAGIUEoQeDvXyCjoew25f7nN3o9GTdimkqoUt0xK/2tWCW1ROOowf6r5KDJK17jRNJGV6jwUJ9AsAd53CNp+MBOHy+E8Scrk/0ATZL3HUGSAuaFKyeITkaQTCjjwunnkxq/VAaeGXZIwI1Vt1llz0Qhbjy2G7l28FhOXm4QZLTdWXtduKwHkfAoFB+HcAWGsIdanoX",
                "Content-Type": "application/json",
            };
            const params = new URLSearchParams({
                startAt: startAt.toString(),
                endAt: endAt.toString(),
            });
            const requestUrl = `${statsEndpoint}?${params}`;

            try {
                const response = await fetch(requestUrl, {
                    method: "GET",
                    headers: headers,
                });
                if (!response.ok) {
                    // 如果响应不是 2xx，抛出错误
                    const errorText = await response.text();
                    throw new Error(
                        `HTTP error! status: ${response.status}, details: ${errorText}`
                    );
                }
                const data = await response.json();
                // 浏览量    data.pageviews.value
                // 访问次数  data.visits.value
                // 访客      data.visitors.value
                document.getElementById("site_uv").textContent = JSON.stringify(data.visitors.value);
                document.getElementById("site_pv").textContent = JSON.stringify(data.pageviews.value);
            } catch (error) {
                console.error("获取 Umami Stats 数据时发生错误:", error); // 控制台输出错误信息
            }
        })();