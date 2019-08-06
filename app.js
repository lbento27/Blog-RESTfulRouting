var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  methodOverride = require("method-override"),
  expressSanitizer = require("express-sanitizer");
//App config
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//mongoose/Schema/model config
// mongoose.connect("mongodb://localhost:27017/restful_blog_app", {
//   useNewUrlParser: true,
//   useFindAndModify: false
// });

//*instead of setting up env every time we close VSCODE make a backup like
var urlDB = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp";

mongoose.connect(urlDB, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true
});

var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now }
});
var Blog = mongoose.model("Blog", blogSchema);
//test create
// Blog.create({
//   title: "Test Blog",
//   image:
//     "https://images.unsplash.com/photo-1507146426996-ef05306b995a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
//   body: "Hello this is a blog post"
// });
//================================================

//RESTFUL ROUTES
app.get("/", function(req, res) {
  res.redirect("blogs");
});
//INDEX ROUTE
app.get("/blogs", function(req, res) {
  Blog.find({}, function(err, blogs) {
    if (err) {
      console.log("ERROR");
    } else {
      res.render("index", { blogs: blogs });
    }
  });
});

//NEW ROUTE
app.get("/blogs/new", function(req, res) {
  res.render("new");
});

//CREATE ROUTE
app.post("/blogs", function(req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body); //this removes any script from the text that user input but let user use html
  //creat blog
  Blog.create(req.body.blog, function(err, newBlog) {
    if (err) {
      res.render("new");
    } else {
      //redirect to index
      res.redirect("/blogs");
    }
  });
});

//SHOW ROUTE
app.get("/blogs/:id", function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("show", { blog: foundBlog });
    }
  });
});

// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("edit", { blog: foundBlog });
    }
    Blog.f;
  });
});

// UPDATE ROUTE
app.put("/blogs/:id", function(req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body); //this removes any script from the text that user input but let user use html

  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(
    err,
    updatedBlog
  ) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

// DELETE ROUTE
app.delete("/blogs/:id", function(req, res) {
  //destroy blog
  Blog.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect("/blogs");
    } else {
      //redirect somewhere
      res.redirect("/blogs");
    }
  });
});

// app.listen(3000, function() {
//   console.log("Server is running!");
// });
//*instead of setting up env every time we close VSCODE make a backup like
var port = process.env.PORT || 3000;
//var ip = process.env.IP || "localhost";//<-DO NOT USE- by default VSCode set to localhost and heroku doesn't need it to(will crash on heroku if activated)

app.listen(port, function() {
  console.log("YelpCamp server has started!!");
});
