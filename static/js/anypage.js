// ==================== Umami Stats 请求 ====================
        (async () => {
            const webid = "ae6cd64c-5900-49c9-9c22-95cedc24a508";
            const statsEndpoint = "https://umami.iletter.top/api/websites/" + webid + "/stats";
            const startAt = 1768060800000;
            const endAt = Date.now(); // 当前时间的时间戳（毫秒）
            const headers = {
                Authorization:
                    "Bearer 3VvA8ETw0ahPhzuNNY+Zxi3agtfOBT2vNRbm0GcPqIyUhm7rExuwj8F8IwiQWcn/rOD2G/TnONPCFIvUECQYp6GuZRTnfOojki533vP/skqf0D6puOZDQQk8Y7ssihXnfyRu5naGhIoj1BCAC7S0D0RiYvzpSYF9zvZqvgxETrCbFazZsqUBolyJd8H2iZiM4Xx3VC+GnkZHZFgQfaaYUvm33a7CLM74PyFpPby63UExMjIPiLQRAOR2hs5wl5JAs5CTYUaq+QHCCz+tWgDQ4FPtIgoZoG8Ugnywv/YEEn1Jv9p3t8ge7m8ttThnPiZWw62PYPWQ3LpFh7nxX9jQX/Y/vaaAyacCoIP5J4VpiClA40GMMptZrThzEQjheegCilb9",
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