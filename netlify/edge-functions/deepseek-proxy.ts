export default async (request: Request) => {
    // 允许来自 GitHub Pages 的跨域请求
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': 'https://xuanxxaa.github.io',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        });
    }

    // 处理 DeepSeek API 请求...
    const apiResponse = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get('DEEPSEEK_API_KEY')}`
        },
        body: JSON.stringify({
            model: "deepseek-chat",
            messages: [{ role: "user", content: userInput }],
            stream: true
        })
    });

    return new Response(apiResponse.body, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Access-Control-Allow-Origin': 'https://xuanxxaa.github.io',
            'Cache-Control': 'no-cache'
        }
    });
};