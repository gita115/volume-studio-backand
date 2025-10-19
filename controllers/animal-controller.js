
const dbAccessorAnimal = require("../dal/db-accessor-animal")
const { db } = require("../models/animalModel")

//כיון שהמודול מחזיר מחלקה, צריך להקצות אותה
const dbAccessor = new dbAccessorAnimal()

class animalController{

    constructor(){}

    getAll = async()=>{
        try {
            let list = await dbAccessor.getAll()
            return list
        } catch (error) {
            //throw console.log(error)
        }
    }

    getById = async(id)=>{
        try {
            let animal = await dbAccessor.getById(id)
            return animal
        } catch (error) {
            throw console.log(error)
        }
    }

    getByAge = async(minAge, maxAge)=>{
        try {
            let animal = await dbAccessor.getByAge(minAge, maxAge)
            return animal
        } catch (error) {
            throw console.log(error)
        }
    }

    newAnimal = async(newAnimal)=>{
        try {
            let data = await dbAccessor.insertAnimal(newAnimal)
            return data
        } catch (error) {
            throw console.log(error)
        }
    }

    editAnimal = async(id, edit)=>{
        try {
            let data = await dbAccessor.updateAnimal(id, edit)
            return data
        } catch (error) {
            throw console.log(error)
        }
    }

    removeAnimal = async(id)=>{
        try {
            let data = await dbAccessor.deleteAnimal(id)
            return data
        } catch (error) {
            throw console.log(error)
        }
    }
}


module.exports = animalController

