import express from "express";
import bodyParser from "body-parser";
import env from "dotenv";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import bcrypt from "bcrypt";
import { createTables, db } from "./dbmodel.js";

const app = express();
const port = 3000;
const saltRounds = 10;
env.config();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());


let flag=true;
app.get('/', async (req, res) => {
  
  if(flag)
  {await createTables();
    console.log("All tables created successfully!");
  flag=false;}
    res.render("index.ejs",{user:req.user});
});
app.get("/dashboard",async(req,res)=>{
    if(req.isAuthenticated()){
        res.render("dashboard.ejs",{user:req.user});
    }else{
        res.redirect("/login");
    }
})
app.get('/profile', (req, res) => {
    if (req.isAuthenticated()) {
      res.render("profile", { user: req.user });
    } else {
      res.redirect("/login");
    }
  });
app.get("/add_new_hackathon",async(req,res)=>{
    if(req.isAuthenticated()){
        res.render("add_new_hackathon.ejs");
    }
    else{
        res.redirect("login");
    }
})
app.post("/add_new_hackathon",async(req,res)=>{
    if(req.isAuthenticated()){
        const {name,location,date,project_title}=req.body;
        const username=req.user.username;
        try {
            const result=await db.query("insert into hackathons(username,name,location,date,project_title) values($1,$2,$3,$4,$5) returning *",[username,name,location,date,project_title]);
            console.log(result.rows);
            res.redirect("/current_hackathons");
        } catch (error) {
            console.log(error)
        }
    }else{
        res.redirect("/login");
    }
})
app.get("/current_hackathons",async(req,res)=>{
    if(req.isAuthenticated()){
        try {
            const result=await db.query("select *from hackathons where username=$1",[req.user.username]);
            console.log(req.user.username,req.user.email);
            console.log(result.rows);
            const hackathon=result.rows;
            res.render("current_hackathons.ejs",{hackathon:hackathon});
        } catch (error) {
            console.log(error);
        }
    }
    else{
        res.redirect("/login");
    }
})
app.get("/awards",async(req,res)=>{
    if(req.isAuthenticated()){
        try {
            const result=await db.query("select *from awards where username=$1",[req.user.username]);
            const awards=result.rows;
            console.log(awards);
            res.render("awards.ejs",{awards:awards});
        } catch (error) {
            console.log(error);
        }

    }else{
        res.redirect("/login");
    }
})
app.post("/awards",async(req,res)=>{
    if(req.isAuthenticated()){ 
        const {hackathon_id,award_name,award_details,award_link}=req.body;
        const username=req.user.username;
        try {
            const result=await db.query("insert into awards(username,hackathon_id,award_name,award_details,award_link) values($1,$2,$3,$4,$5) returning *",[username,hackathon_id,award_name,award_details,award_link]);
            console.log(result.rows);
            res.redirect("/awards");
        } catch (error) {
            console.log(error);
        }
    }else{
        res.redirect("/login");
    }
})
app.get('/add_new_award', (req, res) => {
    if (req.isAuthenticated()) {
        res.render("add_new_award");
    } else {
        res.redirect("/login");
    }
});
app.get("/projects/:hack_id",async(req,res)=>{
    if(req.isAuthenticated()){
        try {
            const username=req.user.username;
            const hack_id=req.params.hack_id;
            const result=await db.query("select *from projects where username=$1 and hackathon_id=$2",[username,hack_id]);
            const project=result.rows;
            console.log(project);
            if(result.rows.length>0){
                res.render("project.ejs",{project:project});
            }else{
                res.render("add_project.ejs",{hack_id:hack_id});
            }
        } catch (error) {
            console.log(error);
        }
    }else{
        res.redirect("/login")
    }
})
app.post("/projects/:hack_id",async(req,res)=>{
    if(req.isAuthenticated()){
        try {
            const username=req.user.username;
            const hack_id=req.params.hack_id;
            const {title,description,tech_stack,repo_link,demo_link}=req.body;
            const result=await db.query("insert into projects(title,description,tech_stack,repo_link,demo_link) values($1,$2,$3,$4,$5) returning *",[title,description,tech_stack,repo_link,demo_link]);
            const project=result.rows;
            res.render(`project.ejs`,{project:project});
        } catch (error) {
            console.log(error);
        }
    }else{
        res.redirect("/login")
    }
})
app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })
  );
  app.get(
    "/auth/google/secrets",
    passport.authenticate("google", {
      successRedirect: "/dashboard",
      failureRedirect: "/login",
    })
  );

  app.post("/register", async (req, res) => {
    const {email,username,password}=req.body;
  
    try {
      const checkResult = await db.query("SELECT * FROM users WHERE username = $1", [
        username,
      ]);
  
      if (checkResult.rows.length > 0) {
        res.redirect("/login");
      } else {
        bcrypt.hash(password, saltRounds, async (err, hash) => {
          if (err) {
            console.error("Error hashing password:", err);
          } else {
            const result = await db.query(
              "INSERT INTO users (username,email, password) VALUES ($1,$2,$3) RETURNING *",
              [username,email, hash]
            );
            const user = result.rows[0];
            req.login(user, (err) => {
              console.log("success");
              res.redirect("/dashboard");
            });
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  });  
app.post('/login',
  passport.authenticate('local', { successRedirect: '/dashboard', failureRedirect: '/login' })
);
app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});
passport.use(new LocalStrategy(
    async function(username, password, cb) {
      try {
          const result = await db.query("SELECT * FROM users WHERE username = $1 ", [
            username,
          ]);
          if (result.rows.length > 0) {
            const user = result.rows[0];
            const storedHashedPassword = user.password;
            bcrypt.compare(password, storedHashedPassword, (err, valid) => {
              if (err) {
                console.error("Error comparing passwords:", err);
                return cb(err);
              } else {
                if (valid) {
                  return cb(null, user);
                } else {
                    console.log("wrong password")
                  return cb(null, false);
                }
              }
            });
          } else {
            return cb("User not found");
          }
      } catch (err) {
          console.log(err);
      }
    }
  ));

  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/secrets",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        console.log(profile);
        const result = await db.query("SELECT * FROM users WHERE email = $1", [
          profile.email,
        ]);
        if (result.rows.length === 0) {
          const newUser = await db.query(
            "INSERT INTO users (email,username, password) VALUES ($1,$2,$3)",
            [profile.email,profile.email, "google"]
          );
          return cb(null, newUser.rows[0]);
        } else {
          return cb(null, result.rows[0]);
        }
      } catch (err) {
        return cb(err);
      }
    }));
      
  passport.serializeUser((user, cb) => {
    cb(null, user);
  });
  
  passport.deserializeUser((user, cb) => {
    cb(null, user);
  });


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
