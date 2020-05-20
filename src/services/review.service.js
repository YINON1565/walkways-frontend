import { utilService } from "./util.service.js";
import { storageService } from "./storage.service.js";
import httpService from "./http.service.js";

const KEY_REVIEWS = 'reviews'

export const reviewService = {
    getReviewsCount,
    getReviews,
    remove,
    saveReview,
}

async function getReviews(id) {
    
    // var reviews = storageService.load(KEY_REVIEWS)
    // if (!reviews){
    //     reviews = _createReviews()
    //     storageService.store(KEY_REVIEWS, reviews)
    // }
    // if (userId){
    //     return reviews.filter(review=>{
    //         return review.about._id === userId
    //     })
    // } else return reviews;
    // return httpService.get(`review`);
    return (!id) ?
        httpService.get(`review`) : httpService.get(`review/${id}`);

}

async function getReviewsCount(){
   return httpService.get('review/count');
}

async function remove(reviewId) {
    return httpService.delete(`review/${reviewId}`)
}

async function saveReview(review) {
    return (review._id) ? _updateReview(review) : _addReview(review);
}

async function _addReview(review) {
    return httpService.post(`review`, review);
}

async function _updateReview(review) {
    return httpService.put(`review`, review);
    // return httpService.put(`review${review._id}`, review);
}