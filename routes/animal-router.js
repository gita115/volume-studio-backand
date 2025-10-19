const express = require("express")

const animalController = require("../controllers/animal-controller")
const animalCtrl = new animalController()

const router = express.Router()

router.get("/getAll",async(req, res)=>{
    try {
        let list = await animalCtrl.getAll()

        res.status(200).json(list)
    } catch (error) {
        
    }
})
router.get("/getById/:id", async(req, res)=>{
    try {
        let id = req.params.id
        let list = await animalCtrl.getById(id)
    
        res.status(200).json(list)
    } catch (error) {
        
    }
})

router.get("/getByAge/:min/:max", async(req, res)=>{
    try {
        let min = req.params.min
        let max = req.params.max
        let list = await animalCtrl.getByAge(min, max)
    
        res.status(200).json(list)
    } catch (error) {
        
    }
})

router.post("/addAnimal", async(req, res)=>{
    try {
        let newAnimal = req.body
        let data = await animalCtrl.newAnimal(newAnimal)
        res.status(200).json(data)
    } catch (error) {
        throw console.log(error)
    }    
})
router.put("/updateAnimal/:id", async(req, res)=>{
    try {
        let id = req.params.id
        let editAnim = req.body
        let data = await animalCtrl.editAnimal(id, editAnim)
        res.status(200).json(data)
    } catch (error) {
        throw console.log(error)
    }    
})
router.delete("/deleteAnimal/:id", async(req, res)=>{
    try {
        let id = req.params.id
        let data = await animalCtrl.delete(id)
        res.status(200).json(data)
    } catch (error) {
        throw console.log(error)
    }    
})

module.exports = router