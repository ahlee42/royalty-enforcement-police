import express from "express";
import axios from "axios";
import cors from "cors";
import bodyParser from "body-parser";

const HELIUS_API_KEY: string = process.env.HELIUS_API_KEY || ""
const GPT3_USERNAME: string = process.env.GPT3_USER_NAME || ""
const GPT3_PASSWORD: string = process.env.GPT3_PASSWORD || ""

const app = express()
app.use(express.json())
app.use(bodyParser.urlencoded({
    extended: true,
}))
app.use(cors())

app.post("/webhook-handler", async(req, res) => {

    // Is this batched? 
    const nfts: any = req.body[0]?.events?.nft?.nfts

    const firstNftMint: any = nfts[0]

    const mint: string = firstNftMint?.mint
    const { data: metadata } = await axios.post(`https://api.helius.xyz/v0/tokens/metadata?api-key=${HELIUS_API_KEY}`, {
        mintAccounts: [ mint ]
    })

    const image: string = metadata.offChainData.image
    const creators: string[] = metadata[0]?.onChainData?.data?.creators?.map(x => x.address);

    const paidRoyalty: boolean = req.body[0].nativeTransfers.some(x => creators?.includes(x.toUserAccount))

    const feePayer: string = req.body[0].feePayer
    
    if (paidRoyalty){
        return 
    }











})


const generateGPT3Dialog = (): Promise<string> => {
    
}






