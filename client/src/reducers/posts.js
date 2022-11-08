import { FETCH_POST, FETCH_ALL, FETCH_BY_SEARCH, CREATE, UPDATE, DELETE, COMMENT, START_LOADING, END_LOADING } from '../constants/actionTypes';
//a reducer is a function that has 2 parameters the state and the action
//then based on the action type we want to run some type of logic or return the state that was changed by the action
// here we renamed state to "posts" (this could be anything btw its just the name of the param) and our state needs to be equal to something
//so here we set that intial value of posts aka our state to equal an array
export default (state = { isLoading: true, posts: [] }, action) => {
    switch (action.type) {
        case START_LOADING:
            return { ...state, isLoading: true }
        case END_LOADING:
            return { ...state, isLoading: false }
        case DELETE:
            return { ...state, posts: state.posts.filter((post) => post._id !== action.payload) }
        case UPDATE:
            return { ...state, posts: state.posts.map((post) => post._id === action.payload._id ? action.payload : post) } //if the post._id is equal to the action.payload._id (the post we just updated) then return the action.payload (the updated post data) else return the regular post we no updates (so if the id doesnt match just return the current post in the posts array)
        case FETCH_ALL:
            return {
                ...state,
                posts: action.payload.data,
                currentPage: action.payload.currentPage,
                numberOfPages: action.payload.numberOfPages
            }
        case FETCH_BY_SEARCH:
            return {
                ...state,
                posts: action.payload
            };
        case FETCH_POST:
            return {
                ...state,
                post: action.payload
            };
        case CREATE:
            return { ...state, posts: [...state.posts, action.payload] };//our posts are contains in an array of object each object is a post. we use the spread operator to include all the previous post but also add the new one we just created     
        case COMMENT:
            return { 
                ...state, posts: state.posts.map(post => {
                    //if the post, is the post that just recieved the new comment then return the updated version of that post with the new comment included
                    if (post._id === action.payload._id) {
                        return action.payload
                    }
                    //if not just return the post normally, no changes
                    return post
                })
             }
        default:
            return state;
    }
}

