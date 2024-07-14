import express from "express";
import env from "dotenv";

env.config();
export  const  user= process.env.PG_USER
export  const  host= process.env.PG_HOST
export  const  database= process.env.PG_DATABASE
export  const  password= process.env.PG_PASSWORD
export  const  port = process.env.PG_PORT