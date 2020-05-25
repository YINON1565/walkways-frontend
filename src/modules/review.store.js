import { userService } from '../services/user.service.js';
import { reviewService } from '../services/review.service.js';
// import { utilService } from '../services/util.service.js';
export default {
    state: {
        reviews: [],
        reviewsCount: null,
        by: userService.getBy(),
        color: ["#a687ec", "#4c207b", "#555076"],
    },
    getters: {
        reviews(state) {
            return state.reviews;
        },
        reviewsCount(state) {
            return state.reviewsCount;
        },
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
        setBy(state){
            state.by = userService.getBy()
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
            return reviews;
        },
        async saveReview(context, { review }) {            
            var isEdit = !!review._id;
            review = await reviewService.saveReview(review);
            context.commit({ type: (isEdit) ? 'updateReview' : 'addReview', review })
            if (!isEdit && review) {
                await reviewService.changeReviewsCount(1)
                context.dispatch({ type: 'loadReviewsCount'})
            }
            return review;
        },
        async removeReview(context, { reviewId }) {
            var msg = await reviewService.remove(reviewId);
            context.commit({ type: 'removeReview', reviewId })
                await reviewService.changeReviewsCount(-1)
                context.dispatch({ type: 'loadReviewsCount'})
                return msg;
        },
    }
}