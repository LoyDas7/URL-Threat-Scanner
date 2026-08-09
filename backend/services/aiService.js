const Groq = require("groq-sdk");

const client = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

async function askAI(message, scanResult) {

    const prompt = `
You are the AI Security Assistant for "Scan The URL".

Your job is to help normal users understand website security scan results.

The user has asked:
"${message}"

Here is the scan result:

${JSON.stringify(scanResult, null, 2)}

Rules:

1. Explain things in very simple language.
2. Assume the user has no cybersecurity knowledge.
3. Explain technical terms when necessary.
4. Base your answer ONLY on the provided scan result.
5. Do not invent information.
6. Do not automatically call a website malicious just because one check failed.
7. Explain what a finding actually means.
8. If something is normal, say that it is normal.
9. If something is concerning, explain why.
10. Give practical advice when appropriate.
11. Do not claim that a scan can guarantee a website is 100% safe.
12. If the user asks about something unrelated to this scan, politely say that you are focused on website security and this scan.

Keep the response clear and reasonably short.
`;

    const response = await client.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
            {
                role: "user",
                content: prompt
            }
        ],
        temperature: 0.3,
        max_tokens: 500
    });

    return response.choices[0].message.content;
}

module.exports = {
    askAI
};