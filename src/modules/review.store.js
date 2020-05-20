import { reviewService } from '../services/review.service.js';
import { userService } from '../services/user.service.js';

function _getBy() {
    var by = {
        _id: 1,
        fullName: 'Anonymous',
        imgUrl: '../../assets/png/login.png'
    }

    const user = JSON.parse(sessionStorage.getItem('loggedinUser'))
        // const user = userService.getLoggeinUser()

    if (user) {
        by = {
            _id: user._id,
            fullName: user.fullName,
            imgUrl: user.imgUrl
        }
    }
    return by
}

export default {
    state: {
        reviews: [],
        reviewsCount: null,
        // currReviews:[],
        // currReviewsForUser:[],
        by: _getBy(),
        color: ["#a687ec", "#4c207b", "#555076"],
    },
    getters: {
        reviews(state) {
            return state.reviews;
        },
        reviewsCount(state) {
            return state.reviewsCount;
        },
        // currReviews(state) {
        //     console.log(state.reviews.length);
        //     return state.currReviews;
        // },
        // currReviewsForUser(state) {
        //     return state.currReviewsForUser;
        // },
        by(state) {
            return state.by;
        },
        colors(state) {
            return state.color
        }
    },
    mutations: {
        setReviews(state, { reviews }) {
            state.reviews = reviews;
        },
        setReviewsCount(state, { reviewsCount }){
            state.reviewsCount = reviewsCount;
        },
        // setCurrReviews(state, { reviews }) {
        //     state.currReviews = reviews;
        // },
        // setCurrReviewsForUser(state, {reviews}){
        //     state.currReviewsForUser = reviews;
        // },
        addReview(state, { review }) {
            state.reviews.unshift(review)
        },
        updateReview(state, { review }) {
            const idx = state.reviews.findIndex(reviewInLoop => reviewInLoop._id === review._id)
            state.reviews.splice(idx, 1, review)
        },
        removeReview(state, { reviewId }) {
            state.reviews = state.reviews.filter(review => review._id !== reviewId)
        },
    },
    actions: {
        async loadReviewsCount(context) {
            const reviewsCount = await reviewService.getReviewsCount();
            context.commit({ type: 'setReviewsCount' , reviewsCount })            
            return reviewsCount;
        },
        async loadReviews(context, { id, isSetReviews = false }) {
            
            const reviews = await reviewService.getReviews(id);
            if (isSetReviews){
                context.commit({ type: 'setReviews', reviews })            
            }
            if (isSetReviews) {
                console.log(id, reviews, 'id, reviews');
            }
            return reviews;
        },
        async saveReview(context, { review }) {            
            var isEdit = !!review._id;
            review = await reviewService.saveReview(review);
            // console.log('review.about._id in store after:', review.about._id);
            // var user = await userService.getById(review.about._id)
            // console.log('user1:', user);
            // const reviews = await reviewService.getReviews(user._id)
            // user.rate = await reviews.reduce((a,b) => a + b.rate, 0) / (reviews.length)
            // var user = await userService.update(user)
            // console.log(user);
            context.commit({ type: (isEdit) ? 'updateReview' : 'addReview', review })
            return review;
        },
        async removeReview(context, { reviewId }) {
            var msg = await reviewService.remove(reviewId);
            context.commit({ type: 'removeReview', reviewId })
            return msg;
        },
    }
}