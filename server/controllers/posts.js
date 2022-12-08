import mongoose from "mongoose"
import PostMessage from "../models/postMessage.js"

export const getPost = async (req, res) => {
    const { id } = req.params
    try {
        const post = await PostMessage.findById(id)
        res.status(200).json(post)
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}
export const getPosts = async (req, res) => {
    const { page } = req.query
    try {
        const LIMIT = 8
        const startIndex = (Number(page) - 1 ) * LIMIT //get the starting index of every page
        const total = await PostMessage.countDocuments({}) // There is going to be x number of pages depending how many total posts we have

        const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex) //db query to get all posts
        res.status(200).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) }) //if successful send 200 status and return the posts in json
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

export const getPostsBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query

    try { 
        const title = new RegExp(searchQuery, "i")
        //or = find the title or find the tags that matches the query, then return the posts that match
        //in = is there a tag IN this array of tags that matches our query
        const posts = await PostMessage.find({ $or: [ {title}, {tags: { $in: tags.split(",") }} ] })

        res.json({ data: posts })
    } catch (error) {
        res.status(404).json({ message: error })
    }
}

export const createPost = async (req, res) => {
    const post = req.body; //data from frontend forum 
    const newPost = new PostMessage({...post, creator: req.userId, createdAt: new Date().toISOString() }) //take the forum data and create a new post using the PostMessage model
    try {
        await newPost.save()
        res.status(201).json(newPost)
    } catch (error) {
        res.status(409).json({message: error.message})
    }
}

export const updatePost = async (req, res) => {
    const { id: _id } = req.params; //inside the destructing block we rename "id" to "_id"
    const post = req.body

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No Post With That ID')

    const updatedPost = await PostMessage.findByIdAndUpdate(_id, { ...post, _id}, { new: true })

    res.json(updatedPost)
}

export const deletePost = async (req,res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No Post With That ID')

    await PostMessage.findByIdAndRemove(id)

    res.json({message: "Post Deleted Successfully"}) 
}

export const likePost = async (req, res) => {
    const { id } = req.params
    
    if (!req.userId) return res.json({message: "Not Authorized" })
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No Post With That ID')

    const post = await PostMessage.findById(id)

    const index = post.likes.findIndex((id) => id === String(req.userId));

    if (index === -1) {
        //like the post
        post.likes.push(req.userId)
    } else {
        post.likes = post.likes.filter(id => id !== String(req.userId))
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true })

    res.json(updatedPost)
}

export const commentPost = async (req, res) => {
    const { id } = req.params
    const { value } = req.body
    const post = await PostMessage.findById(id)

    post.comments.push(value)
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true })

    res.json(updatedPost)
}