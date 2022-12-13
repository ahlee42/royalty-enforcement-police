var express = require("express");
var axios = require("axios");
var cors = require("cors");
var bodyParser = require("body-parser");
const http = require('http'); // or 'https' for https:// URLs
const fs = require('fs');
var Twitter = require("twitter-api-sdk")

const HELIUS_API_URL= "https://api.helius.xyz"
const GPT3_API_URL = "https://api.openai.com"
const TWITTER_API_URL = "https://api.twitter.com"
const PORT = parseInt(process.env.PORT || "8080") 
const HELIUS_API_KEY= process.env.HELIUS_API_KEY || ""
const GPT3_API_KEY= process.env.GPT3_API_KEY || ""
const TWITTER_API_KEY = process.env.TWITTER_API_KEY || ""

const twitter = new Twitter.Client(TWITTER_API_KEY);

const app = express()

app.use(express.json())
app.use(bodyParser.urlencoded({
    extended: true,
}))
app.use(cors())

import {
    prompt_style,
    prompt_narrators,
    prompt_beginning,
    prompt_middle,
    prompt_end
} from "./gpt_prompt_strings"


const sendTweet = async(tweetText, mediaObject) => {
    try {
      const postTweet = await twitter.tweets.createTweet({
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


const uploadMedia = async(imageUrl) => {
    const base64Image = await getBase64(imageUrl)
    const response = axios.post(
        "https://upload.twitter.com/1.1/media/upload.json?media_category=tweet_image",
        {
            media: "bytes",
            media_category: "tweet_image",
            media_data: base64Image
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TWITTER_API_KEY}`
            }
        }
    )
    if (response.status == 200){
        return
    }
    throw Error(`Could not upload media: ${imageUrl}`)
}

const generateGpt3Prompt = (feePayer) => {
    const style = prompt_style[Math.floor(Math.random() * prompt_style.length) - 1]
    const narrarator = prompt_narrators[Math.floor(Math.random() * prompt_narrators.length) - 1]
    const end = prompt_end[Math.floor(Math.random() * prompt_end.length) - 1]
    return `${prompt_beginning} ${style} narrated ${prompt_middle} ${narrarator} about ${feePayer} ${end}`
}

function getBase64(url) {
    return axios
      .get(url, {
        responseType: 'arraybuffer'
      })
      .then(response => Buffer.from(response.data, 'binary').toString('base64'))
}

const getGpt3Dialog = async(feePayer) => {
    const temperature = Math.random()
    const prompt = generateGpt3Prompt(feePayer)
    try{
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
    } catch {}
    throw Error(`Could not getGpt3Dialog with feePayer: ${feePayer} and prompt: ${prompt} w/ error: ${error.message}.`)
}

// app.post("/", async(req, res) => {

//     try{
//         const nfts = req.body[0]?.events?.nft?.nfts

//         const firstNftMint = nfts[0]
    
//         const mint= firstNftMint?.mint
//         const { data: metadata } = await axios.post(`${HELIUS_API_URL}/v0/tokens/metadata?api-key=${HELIUS_API_KEY}`, {
//             mintAccounts: [ mint ]
//         })
    
//         const imageUrl = metadata.offChainData.image
    
//         const creators = metadata[0]?.onChainData?.data?.creators?.map(x => x.address);
    
//         const paidRoyalty = req.body[0].nativeTransfers.some(x => creators?.includes(x.toUserAccount))
    
//         const feePayer= req.body[0].feePayer
        
//         if (paidRoyalty){
//             return 
//         }
    
//         const gpt3Prompt = getGpt3Dialog(feePayer) 
    
//         const response = uploadMedia(imageUrl)


//         sendTweet(gpt3Prompt, "_")
    
    
//         res.status(200).json({
//             ok: true,
//             message: "Royalty Enforcement Police Tweet created"

//         })
//     } catch(error){
//         res.status(500).json({
//             ok: false,
//             message: "Royalty Enforcement Police crashes"
//         })
//     }


    

// })


// app.listen(PORT, async() => {
//     console.log(`Royalty Enforcement Police started on port: ${PORT}`)
// })


(async() => {
    const res = await uploadMedia("https://www.gravatar.com/avatar/9911ba45917327b37ffabe94a715bb2c?s=64&d=identicon&r=PG")
    console.log(res)
})()