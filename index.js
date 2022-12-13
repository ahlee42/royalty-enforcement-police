var express = require("express");
var axios = require("axios");
var cors = require("cors");
var bodyParser = require("body-parser");

const HELIUS_API_URL = "https://api.helius.xyz"
const GPT3_API_URL = "https://api.openai.com"
const PORT = parseInt(process.env.PORT || "8080")
const HELIUS_API_KEY = process.env.HELIUS_API_KEY || ""
const GPT3_API_KEY = process.env.GPT3_API_KEY || ""

var Twitter = require('twitter');
var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})

const app = express()

app.use(express.json())
app.use(bodyParser.urlencoded({
    extended: true,
}))
app.use(cors())


const nfts = req.body[0] ? .events ? .nft ? .nfts

const firstNftMint = nfts[0]

const mint = firstNftMint ? .mint
const { data: metadata } = await axios.post(`${HELIUS_API_URL}/v0/tokens/metadata?api-key=${HELIUS_API_KEY}`, {
    mintAccounts: [mint]
})

const image = metadata.offChainData.image

const creators = metadata[0] ? .onChainData ? .data ? .creators ? .map(x => x.address);

const paidRoyalty = req.body[0].nativeTransfers.some(x => creators ? .includes(x.toUserAccount))

const feePayer = req.body[0].feePayer

if (paidRoyalty) {
    return
}

const gpt3Prompt = getGpt3Dialog(feePayer)

const tweetText = feePayer + " didn't pay royalties on this NFT. To denounce this action, we present the following: ";

// Upload GPT screenshot to Twitter
const mediaGPT = await uploadMedia();

// Upload NFT image to Twitter
const mediaNFT = await uploadMedia();

// Send out tweet here.
sendTweet(tweetText);


})

async function sendTweet(tweetText: string, mediaObject: object) => {
    try {
        const postTweet = await twitterClient.tweets.createTweet({
            // The text of the Tweet
            text: tweetText,
            media: mediaObject,
        });
        console.dir(postTweet, {
            depth: null,
        });
    } catch (error) {
        console.log(error);
    }
})();

const generateGpt3Prompt = (feePayer) => {
    const style = prompt_style[Math.floor(Math.random() * prompt_style.length) - 1]
    const narrarator = prompt_narrators[Math.floor(Math.random() * prompt_narrators.length) - 1]
    const end = prompt_end[Math.floor(Math.random() * prompt_end.length) - 1]
    return `${prompt_beginning} ${style} narrated ${prompt_middle} ${narrarator} about ${feePayer} ${end}`

}

const getGpt3Dialog = async(feePayer) => {
    const temperature = Math.random()
    const prompt = generateGpt3Prompt(feePayer)
    const response = await axios.post(
        `${GPT3_API_URL}/v1/completions`, {
            model: "text-davinci-003",
            prompt,
            max_tokens: 4000,
            temperature
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GPT3_API_KEY}`
            }
        },
    )
    if (response.status == 200) {
        const { choices } = response.data
        const dialog = choices[0]
        return dialog.text
    }
    throw Error(`Could not getGpt3Dialog with feePayer: ${feePayer} and prompt: ${prompt}.`)
}

app.post("/", async(req, res) => {

    const shameText = await gpt3.sendMessage('Write a python version of bubble sort.')

    console.log(shameText)

    const firstNftMint = nfts[0]

    const mint = firstNftMint ? .mint
    const { data: metadata } = await axios.post(`${HELIUS_API_URL}/v0/tokens/metadata?api-key=${HELIUS_API_KEY}`, {
        mintAccounts: [mint]
    })

    const image = metadata.offChainData.image

    const creators = metadata[0] ? .onChainData ? .data ? .creators ? .map(x => x.address);

    const paidRoyalty = req.body[0].nativeTransfers.some(x => creators ? .includes(x.toUserAccount))

    const feePayer = req.body[0].feePayer

    if (paidRoyalty) {
        return
    }

    const gpt3Prompt = getGpt3Dialog(feePayer)

    sendTweet(gpt3Prompt, "_")


    res.status(200).json({
        ok: true,
        message: "Royalty Enforcement Police Tweet created"

    })
} catch (error) {
    res.status(500).json({
        ok: false,
        message: "Royalty Enforcement Police crashes"
    })
}




})


app.listen(PORT, async() => {
    console.log(`Royalty Enforcement Police started on port: ${PORT}`)
})