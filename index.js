var express = require("express");
var axios = require("axios");
var cors = require("cors");
var bodyParser = require("body-parser");


const HELIUS_API_URL= "https://api.helius.xyz"
const GPT3_API_URL = "https://api.openai.com"
const PORT = parseInt(process.env.PORT || "8080") 
const HELIUS_API_KEY= process.env.HELIUS_API_KEY || ""
const GPT3_API_KEY= process.env.GPT3_API_KEY || ""

const app = express()

app.use(express.json())
app.use(bodyParser.urlencoded({
    extended: true,
}))
app.use(cors())


const sendTweet = async(tweetText, mediaObject) => {
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
}

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
        `${GPT3_API_URL}/v1/completions`,
        {
            model: "text-davinci-003",
            prompt,
            max_tokens: 4000,
            temperature
        },
        { headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GPT3_API_KEY}`
        } 
    },     
    )
    if (response.status == 200){
        const { choices } = response.data
        const dialog = choices[0]
        return dialog.text
    }
    throw Error(`Could not getGpt3Dialog with feePayer: ${feePayer} and prompt: ${prompt}.`)
}

const app = express()

app.use(express.json())
app.use(bodyParser.urlencoded({
    extended: true,
}))
app.use(cors())

app.post("/", async(req, res) => {

    const nfts = req.body[0]?.events?.nft?.nfts

    const firstNftMint = nfts[0]

    const mint= firstNftMint?.mint
    const { data: metadata } = await axios.post(`${HELIUS_API_URL}/v0/tokens/metadata?api-key=${HELIUS_API_KEY}`, {
        mintAccounts: [ mint ]
    })

    const image = metadata.offChainData.image

    const creators = metadata[0]?.onChainData?.data?.creators?.map(x => x.address);

    const paidRoyalty = req.body[0].nativeTransfers.some(x => creators?.includes(x.toUserAccount))

    const feePayer= req.body[0].feePayer
    
    if (paidRoyalty){
        return 
    }

    const gpt3Prompt = getGpt3Dialog(feePayer) 

    sendTweet(gpt3Prompt, "_")

})


app.listen(PORT, async() => {
    console.log(`Royalty Enforcement Police started on port: ${PORT}`)
})
