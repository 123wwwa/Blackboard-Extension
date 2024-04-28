import type { PlasmoMessaging } from "@plasmohq/messaging"
import { getChromeStorage } from "~shared/storage"
import type { AskGptOptions } from "~shared/types/handlerTypes"
export type RequestBody = {
    options: AskGptOptions
}
export type ResponseBody = {
    content?: string
    error?: string
}
const handler: PlasmoMessaging.MessageHandler<RequestBody, ResponseBody> = async (req, res) => {
    const apiKey = await (getChromeStorage("settings")).apiKey;
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}` // replace with your key
        },
        body: JSON.stringify(req.body.options)
    });
    const data = await response.json();
    if (data.error) {
        res.send({ "error": data.error.message });
        return;
    }
    res.send({
        "content": data.choices[0].message.content
    })
}

export default handler
