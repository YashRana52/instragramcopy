import sharp from "sharp";
import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";

export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image) {
      return res.status(400).json({ message: "Image required" });
    }

    // Image upload
    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    // Buffer to data URI
    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString("base64")}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);

    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });

    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({ path: "author", select: "-password" });

    return res.status(201).json({
      message: "New post added",
      post,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      });

    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "username profilePicture",
      })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      });

    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// Like post
export const likePost = async (req, res) => {
  try {
    const likeKrneWalaUserKiId = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found", success: false });
    }

    // Like logic
    await post.updateOne({ $addToSet: { likes: likeKrneWalaUserKiId } });
    await post.save();

    // Implement Socket.IO for real-time application
  

    return res.status(200).json({
      message: "Post Liked",
      success: true,
    });
  } catch (error) {
    console.log(error); 
  }
};

// Dislike post
export const dislikePost = async (req, res) => {
  try {
    const likeKrneWalaUserKiId = req.id;
    const postId = req.params.id; 

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found", success: false });
    }

    // Dislike logic
    await post.updateOne({ $pull: { likes: likeKrneWalaUserKiId } });
    await post.save();

    // Implement Socket.IO for real-time application
   

    return res.status(200).json({
      message: "Post Disliked",
      success: true,
    });
  } catch (error) {
    console.log(error); 
  }
};

// Comment add logic
export const addComment = async (req, res) => {
  try {
    const postId = req.params.id; 
    const commentKrneWalaUserKiId = req.id;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        message: "Text is required",
        success: false,
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    const comment = await Comment.create({
      text,
      author: commentKrneWalaUserKiId,
      post: postId,
    }).populate({
      path: "author",
      select: "username, profilePicture",
    });

    post.comments.push(comment._id);
    await post.save();

    // Implement Socket.IO for real-time comment updates
   
    return res.status(200).json({
      message: "Comment added",
      comment,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getCommentsOfPost = async(req,res)=>{
  try {
    const postId= req.params.id;


    const comments = await Comment.find({post:postId}).populate('author','username , profilePicture');
    if (!comments) {
      return res.status(404).json({
        message: "No comments for this post",
      
        success: false,

      });

return res.status(200).json({
     
     
      success: true,
      comments,
    });
      
    }
    
  } catch (error) {
    console.log(error);
    
    
  }
}

// delete post

export const deletePost = async(req,res)=>{
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
     
     message:'Post not found',
     success:false
        
      });
      
    }
    // check the user is owner of the post
    if (post.author.toString()!== authorId) {
      return res.status(403).json({
     
        message:'Unauthorized',
        success:false
           
         });

      
    }
    // delete post
    await Post.findByIdAndDelete(postId);
    // remove the postid from the user
    let user = await User.findById(authorId)
    user.posts = user.posts.filter(id => id.toString()!==postId)
    await user.save()
    // delete krne bo comment jo post pe kiye gye ho
    await Comment.deleteMany({post:postId})
    return res.status(200).json({
     
     
      success: true,
      message:'post deleted'
      
    });


  } catch (error) {
    console.log(error);
    
    
  }
}
// post ko bookmark ka logic
export const bookMarkPost = async (req,res)=>{
  try {
    const postId = req.params.id
    const authorId = req.id;
    const post = await Post.findById(postId)
    if (!post) {
      return res.status(404).json({message:'Post not found', success:false})
      
    }
    const user = await User.findById(authorId)
    if (user.bookmarks.includes(post._id)) {
      // already bookmark---> remove from bookmarks
      await user.updateOne({$pull:{bookmarks:post._id}})
      await user.save()
      return res.status(200).json({type:'unsaved',message:'post removed from bookmars'})
      
    }
    else{
      //add to book marks
      await user.updateOne({$addToSet:{bookmarks:post._id}})
      await user.save()
      return res.status(200).json({type:'saved',message:'post  bookmarked'})

    }
    
  } catch (error) {
    console.log(error);
    
    
  }
}