import express from "express"
import mongoose from "mongoose"

const app = express()
app.use(express.json())

mongoose.connect("mongodb://localhost:27017/myfirstdatabase", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.set('strictQuery', false);

const giftSchema = new mongoose.Schema({
    name: String,
    price: Number,
    to: String,
    from: String,
    type: String
})

const gift = mongoose.model("Gift", giftSchema)

app.get("/gifts", async (req, res) => {
    const gifts = await gift.find()
    res.json(gifts)
})

app.post("/gifts", async (req, res) => {
    const newGift = new gift(req.body);
    await newGift.save()
    res.json(newGift)
})

app.put("/gifts/:id", async (req, res) => {
    const { id } = req.params
    const updatedData = req.body
    const updatedGift = await gift.findByIdAndUpdate(id, updatedData, {
        new: true
    })
    if(!updatedData){
        return res.status(404).json({error: "gift not found"})
    }
    res.json(updatedGift)
})
app.delete("/gifts/:id", async (req, res) => {
    const { id } = req.params
    const deletedGift = await gift.findByIdAndDelete(id)
    if (!deletedGift){
        return res.status(404).json({error: "gift not found"})
    }
    res.json({message: "Gift deleted", gift: deletedGift.name})
})

app.listen(3002, () => 
    console.log("Server is running at http://localhost:3002")
)