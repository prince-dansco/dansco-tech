import express from "express";
import { createUser,getAllUser,editUserDetail, deleteUser,getSingleUser } from "../controller/userDetail.js";

const route = express.Router();

route.get('/', getAllUser )
route.post('/detail', createUser )
route.get('/:id', getSingleUser )
route.put('/:id', editUserDetail )
route.delete('/:id', deleteUser )




export default route;