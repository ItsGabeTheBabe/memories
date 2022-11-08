import axios from 'axios'

const API = axios.create({ baseURL: 'https://memories-fullstack-webapp.herokuapp.com/' })

//we need to pass our token to the request header, so that when the req reaches the middleware it can use the token. Look at the middleware auth.js file to see how it uses the token we just added to the header
API.interceptors.request.use((req) => {
    if (localStorage.getItem('profile')) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`
    }
    return req //return req so we can make the requests below
})

export const fetchPost = (id) => API.get(`/posts/${id}`)
export const fetchPosts = (page) => API.get(`/posts?page=${page}`)
export const fetchPostsBySearch = (searchQuery) => API.get(`/posts/search?searchQuery=${searchQuery.search || 'none'}&tags=${searchQuery.tags}`)
export const createPost = (newPost) => API.post("/posts", newPost)
export const updatePost = (id, updatedPost) => API.patch(`/posts/${id}`, updatedPost)
export const deletePost = (id) => API.delete(`/posts/${id}`)
export const likePost = (id) => API.patch(`/posts/${id}/likePost`)
export const comment = (value,id) => API.post(`/posts/${id}/commentPost`, { value })

export const signIn = (FormData) => API.post('/user/signin', FormData)
export const signUp = (FormData) => API.post('/user/signup', FormData)