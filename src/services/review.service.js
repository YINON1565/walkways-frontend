import { utilService } from "./util.service.js";
import { storageService } from "./storage.service.js";
import httpService from "./http.service.js";

const KEY_REVIEWS = 'reviews'
const KEY_REVIEWS_COUNT = 'reviewsCount'

export const reviewService = {
    getReviewsCount,
    getReviews,
    remove,
    saveReview,
    changeReviewsCount
}

function changeReviewsCount(diff) {
   var reviewsCount = storageService.load(KEY_REVIEWS_COUNT)
   if (reviewsCount) {
       reviewsCount += diff
       storageService.store(KEY_REVIEWS_COUNT, reviewsCount)
   }
}

async function getReviews(id) {
    return (!id) ?
    httpService.get(`review`) : 
    httpService.get(`review/${id}`);
}

async function getReviewsCount(){
   var reviewsCount = storageService.load(KEY_REVIEWS_COUNT)
   if (!reviewsCount) {
       reviewsCount = await httpService.get('review/count');
       storageService.store(KEY_REVIEWS_COUNT, reviewsCount)
   } 
   return reviewsCount
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