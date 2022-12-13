var express = require("express");
var axios = require("axios");
var cors = require("cors");
var bodyParser = require("body-parser");
const http = require('http');
const fs = require('fs');
var Twitter = require('twitter-api-sdk');

const HELIUS_API_URL= "https://api.helius.xyz"
const GPT3_API_URL = "https://api.openai.com"
const PORT = parseInt(process.env.PORT || "8080") 
const HELIUS_API_KEY= process.env.HELIUS_API_KEY || "624a8340-7e27-4f80-98a8-d36af94f3863"
const GPT3_API_KEY= process.env.GPT3_API_KEY || "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"
const TWITTER_API_KEY = process.env.TWITTER_API_KEY || "AAAAAAAAAAAAAAAAAAAAADaKkQEAAAAAQBPbcjVbukNwz8H5%2BWH5P3Wl2Yc%3DrUTgx4LX017hKvEOIUROi3YohJRwOVIK7DTFh0JByFAqHMVcXv"

const twitter = new Twitter.Client(TWITTER_API_KEY);

const app = express()

app.use(express.json())
app.use(bodyParser.urlencoded({
    extended: true,
}))
app.use(cors())


const prompt_beginning = "Write a ";
const prompt_style = [
    'rap',
    'song',
    'poem',
    'speech',
    'haiku',
    'sonnet',
    'statement',
    'prayer',
]
const prompt_middle = "by ";
const prompt_narrators = [
    'Sam Bankman Fried',
    'Barack Obama',
    'Taylor Swift',
    'Ariana Grande',
    'Justin Bieber',
    'Donald Trump',
    'Bill Clinton',
    'Elon Musk',
    'Kanye West',
    'Chris Rock',
    'Dave Chapelle',
    'Katy Perry',
    'Rihanna',
    'Narendra Modi',
    'Lady Gaga',
    'Selena Gomez',
    'Britney Spears',
    'Demi Lovato',
    'Drake',
    'Miley Cyrus',
    'Jimmmy Fallon',
    'Winston Churchill',
    'Bill Gates',
    'Abraham Lincoln',
    'Thomas Jefferson',
    'John F. Kennedy',
    'Aristotle',
    'George Washington',
    'Napoleon',
    'William Shakespeare',
    'Cleopatra',
    'Julius Caesar',
    'Alexander the Great',
    'a 14 year old girl with ADHD',
    'a 60 year old man who has lived through several financial bubbles',
    'a 87 year old Japanese man who runs a pizza shop',
    'a vegan crypto billionaire',
    'a 40 year old man who roleplays as a cat',
    'a professor from MIT',
    'a detective penguin',
    'a cat accountant',
    'a dog dentist',
    'a parrot pilot',
    'a proud squirrel doctor',
    'a turtle traffic cop',
];

const prompt_end = [
    ' that compares not paying royalties on digital art to stubbing your toe.',
    ' that compares not paying royalties on digital art to tripping on a banana.',
    ' that compares not paying royalties on digital art to farting in an elevator.',
    ' that compares not paying royalties on digital art to eating the last cookie in the jar.',
    ' that compares not paying royalties on digital art to trying to eat a piece of cake without taking a bite.',
    ' that compares not paying royalties on digital art to trying to swim without getting wet.',
    ' that compares not paying royalties on digital art to trying to run a marathon without training.',
    ' that compares not paying royalties on digital art to trying to sneak into a movie theater without paying.',
    ' that compares not paying royalties on digital art to borrowing a friend\'s car without asking.',
    ' that compares not paying royalties on digital art to going to a restaurant and not tipping the waiter.',
    ' that compares not paying royalties on digital art to going to a concert and trying to sneak into the VIP section.',
    ' that compares not paying royalties on digital art to trying to shoplift from a grocery store.',
    ' that compares not paying royalties on digital art to trying to get a free gym membership by using someone else\'s ID.',
    ' that compares not paying royalties on digital art to trying to use a fake ID to buy alcohol',
    ' that compares not paying royalties on digital art to a penguin walking into a bar, ordering a martini, and proceeding to perform stand-up comedy for the astonished patrons.',
    ' that compares not paying royalties on digital art to a group of cows in a field starting a synchronized dance routine to the beat of "YMCA" blaring from a nearby radio.',
    ' that compares not paying royalties on digital art to a chicken wearing a tutu and ballet slippers performing a perfect pas de deux with a surprised farmer.',
    ' that compares not paying royalties on digital art to a cat, a dog, and a hamster teaming up to open a detective agency and solve the case of the missing toilet paper roll.',
    ' that compares not paying royalties on digital art to a group of geriatric dolphins escaping from a retirement home and head to the beach for a wild night of surfing and partying.',
    ' that compares not paying royalties on digital art to a group of chickens start a band and perform a rocking concert in the middle of a farm.',
    ' that scolds the users for not paying royalties on digital art like a caring grandma.',
    ' that compares not paying royalties on digital art to a sandwich that comes alive and wreaks havoc on their local neighborhood.',
    ' that compares not paying royalties on digital art to accidentally dropping your phone into a toilet.',
    ' that compares not paying royalties on digital art to cartwheeling away from an awkward social situation.',
    ' that compares not paying royalties on digital art to opening a stubborn jar of pickles.',
    ' that compares not paying royalties on digital art to doing a yoga pose but instead falling into a pile of laundry.',
    ' that compares not paying royalties on digital art to leverage longing on a Solana investment.',
    ' that compares not paying royalties on digital art to a reality TV show.',
    ' that compares not paying royalties on digital art to cooking a fancy meal for a date gone wrong.',
    ' that compares not paying royalties on digital art to a very romantic telenovela.',
    ' that compares not paying royalties on digital art to doing a magic trick but accidentally setting your own hair on fire.',
    ' that compares not paying royalties on digital art to losing weight.',
    ' that compares not paying royalties on digital art to taking ice baths',
    ' that compares not paying royalties on digital art to taking a cold shower.',
    ' that compares not paying royalties on digital art to breakdancing.',
    ' that compares not paying royalties on digital art to dirt biking.',
    ' that compares not paying royalties on digital art to being arrested by a law enforcement agency.',
    ' that compares not paying royalties on digital art to making a sandwich.',
    ' that compares not paying royalties on digital art to brushing teeth.',
    ' that compares not paying royalties on digital art to baking cookies with a pair of scissors.',
    ' that compares not paying royalties on digital art to playing Animal Crossing',
    ' that compares not paying royalties on digital art to an intense game of Starcraft',
    ' that compares not paying royalties on digital art to shitposting on Twitter',
]


const sendTweet = async(tweetText, mediaObject) => {
    try {
      const postTweet = await twitter.tweets.createTweet({
        // The text of the Tweet
        text: tweetText,
        // media: mediaObject,        
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

    try{
        const nfts = req.body[0]?.events?.nft?.nfts

        const nft = nfts[0]
    
        const mint= nft?.mint
        const { data: metadata } = await axios.post(`${HELIUS_API_URL}/v0/tokens/metadata?api-key=${HELIUS_API_KEY}`, {
            mintAccounts: [ mint ]
        })
    
        const creators = metadata[0]?.onChainData?.data?.creators?.map(x => x.address);
    
        const paidRoyalty = req.body[0].nativeTransfers.some(x => creators?.includes(x.toUserAccount))
    
        const feePayer= req.body[0].feePayer
        
        if (paidRoyalty){
            return 
        }
    
        const gpt3Prompt = getGpt3Dialog(feePayer) 

        sendTweet(gpt3Prompt, null)
    
    
        res.status(200).json({
            ok: true,
            message: "Royalty Enforcement Police Tweet created"

        })
    } catch(error){
        res.status(500).json({
            ok: false,
            message: "Royalty Enforcement Police crashes"
        })
    }
})


app.listen(PORT, async() => {
    console.log(`Royalty Enforcement Police started on port: ${PORT}`)
})

