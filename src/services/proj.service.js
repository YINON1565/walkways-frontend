import { utilService } from './util.service.js'
import { storageService } from './storage.service.js';
import { userService } from './user.service.js';
import httpService from './http.service.js'

const KEY_FAVORS = 'projs'
const KEY_PROJS_COUNT = 'projsCount'

export const projService = {
    getEmptyProj,
    query,
    getById,
    save,
    remove,
    getHeaderObj,
    loadCategoties,
    loadTags,
    getProjsCount,
    changeProjsCount,
}
function changeProjsCount(diff) {
   var projsCount = storageService.load(KEY_PROJS_COUNT)
   if (projsCount) {
       projsCount += diff
       storageService.store(KEY_PROJS_COUNT, projsCount)
   }
}

async function getProjsCount(){
    var projsCount = storageService.load(KEY_PROJS_COUNT)
    if (!projsCount) {   
       const queryParams = new URLSearchParams();
       queryParams.set('count', true)
       projsCount = await httpService.get(`proj?${queryParams}`);
       storageService.store(KEY_PROJS_COUNT, projsCount)
   } 
   return projsCount
}

function query(filterBy, limit, skip) {
    const queryParams = new URLSearchParams();
    if (filterBy) {
        for (const property in filterBy) {
            if (filterBy[property]){
                queryParams.set(property, filterBy[property])
            }
        } 
        if (limit) {
            queryParams.set('limit', limit)
            queryParams.set('skip', skip)
        }
        return httpService.get(`proj?${queryParams}`);
    }
    if (limit) {
        queryParams.set('limit', limit)
        return httpService.get(`proj?${queryParams}`);
    }
    

    return httpService.get('proj');
}

function getById(projId) {
    return httpService.get(`proj/${projId}`);
}

function remove(projId) {
    return httpService.delete(`proj/${projId}`);
}

function save(proj) {
    return (proj._id) ? _update(proj) : _add(proj);
}

function _add(proj) {
    return httpService.post(`proj`, proj);
}

function _update(proj) {
    return httpService.put(`proj/${proj._id}`, proj);
}

function getEmptyProj() {

    return {
        organization: '',
        title: '',
        category: '',
        description: '',
        createdBy: {},
        membersNeeded: 1,
        membersApplyed: [],
        date: [],
        startAt: '',
        endsAt: '',
        imgUrls: [],
        position: { txtAddress: '', lat: 33.886917, lng: 9.537499 },
        requirements: {
            minAge: 14,
            languages: ['English'],
            otherSkills: [],
        },
        tags: [],
        rate: {average: null, length: 0}
    }
}


function _getValidDate(date) {
    return date.getFullYear() + '-' + _padNum((date.getMonth() + 1)) + '-' + _padNum(date.getDate());
}

function _getValidtime(time) {
    return _padNum((time.getHours() + 1)) + ':' + _padNum(time.getMinutes());
}

function _padNum(num) {
    return (num < 10) ? '0' + num : num;
}


function loadTags() {
    return ["Airport Taxi", "Housing", "Single Bed", "Double Bed", "Food", "Wifi", "Hot Water"]
}

function loadCategoties() {
    return [
        {
            category: "childcare",
            title: "Child Care",
            imgUrl:
                "https://images7.design-editor.com/91/9184191/3958%2F50493C55-F17D-C782-89A5-C19900347370.jpg"
        },
        {
            category: "education",
            title: "Education",
            imgUrl:
                "https://cdn.shopify.com/s/files/1/1151/8374/articles/smaller_lead_photo_2048x.jpg?v=1523044466"
        },
        {
            category: "animalsAndWildlife",
            title: "Animals & Wildlife",
            imgUrl:
                "https://i.pinimg.com/originals/f6/b8/c2/f6b8c285b662090279a4c1f5089bb53d.jpg"
        },
        {
            category: "environmentalProtection",
            title: "Environmental Protection",
            imgUrl:
                "https://beaches.lacounty.gov/wp-content/uploads/2016/10/BeachCleaning.jpg"
        },
        {
            category: "farming",
            title: "Farming",
            imgUrl:
                "https://www.thebalancesmb.com/thmb/zLMhuQKCL24jIckZmKqw6E4n2hI=/2121x1414/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-585859259-57997e215f9b589aa94c4243.jpg"
        },
        {
            category: "scubaDiving",
            title: "Scuba Diving",
            imgUrl:
                "https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_1295,h_720,f_auto/w_80,x_15,y_15,g_south_west,l_klook_water/activities/i8v1v92sfkikn0ro47ba/ScubaDivingLessonsinGuambyJNSDives.webp"
        },
        {
            category: "humanitarian",
            title: "Humanitarian",
            imgUrl:
                "https://img.rawpixel.com/s3fs-private/rawpixel_images/website_content/387-mj-5779.jpg?auto=format&bg=transparent&con=3&cs=srgb&dpr=1&fm=jpg&ixlib=php-3.1.0&mark=rawpixel-watermark.png&markalpha=90&markpad=13&markscale=10&markx=25&q=75&usm=15&vib=3&w=1400&s=19310451bd014a0ee3714a2fc0bc90b3"
        },
        {
            category: "healthcare",
            title: "Health Care",
            imgUrl:
                "https://mikedanneskjold.files.wordpress.com/2013/01/sickness-3rd-world-doctor.jpg"
        },
        {
            category: "sports",
            title: "Sports",
            imgUrl: "https://www.om.org/img/l23630.jpg"
        },
        {
            category: "art",
            title: "Art",
            imgUrl:
                "https://levlalev.com/wp-content/uploads/2019/06/Art-Projec-to-benefit-orphans.jpg"
        },
        {
            category: "humanRights",
            title: "Human Rigths",
            imgUrl: "https://i.ytimg.com/vi/fmT2soVvyLA/maxresdefault.jpg"
        }
    ]
}


function getHeaderObj(filter) {

    var headerObj = {
        'animalsAndWildlife': {
            title: 'Animals And Wildlife',
            desc: 'Wildlife conservation is the perfect volunteer opportunity to protect endangered species from extinction. Volunteer for wildlife conservation projects and help endangered species, like elephants or sloths, that are threatened by habitat loss and human influences. Care for exotic or domestic wildlife and prevent species from going extinct!',
            imgUrl: 'https://i.insider.com/5bebcf4d66be5046a2737572?width=1136&format=jpeg'
        },
        'childcare': {
            title: 'Child Care',
            desc: 'Volunteering with children abroad is a great opportunity to reach out to those who need help the most and discover new countries at the same time. If you love working with children, volunteer at one of the many kindergartens and daycare centers around the world that take care of children from underprivileged families who can\'t afford childcare.',
            imgUrl: 'https://content3.jdmagicbox.com/comp/hyderabad/f5/040pxx40.xx40.190412140024.w6f5/catalogue/people-helping-children-hyderabad-1etcsznxqd.jpg'
        },
        'environmentalProtection': {
            title: 'Environmental Protection',
            desc: 'Environmental volunteering abroad is your chance to protect our nature on land as well as below the water. If you love the great outdoors and hands-on work, then our nature conservancy projects will be the perfect choice for you!',
            imgUrl: 'https://www.ocregister.com/wp-content/uploads/2018/05/hb-cleanup10-0604_.jpg'
        },
        'farming': {
            title: 'Farming',
            desc: 'Support sustainable organic farming and educate locals on how to get the best results of their harvest whilst protecting the environment. Are you a coffee lover? Help small farmers with the work on their coffee plantations and learn where your daily morning coffee comes from.',
            imgUrl: 'https://media.npr.org/assets/img/2017/12/15/farm-59c12ff25ccf74e5b1da779a3ca8a0205491f332.jpg'
        },
        'scubaDiving': {
            title: 'Scuba Diving',
            desc: 'Help to restore coral reefs, carry out surveys of endangered marine life and educate tourists and locals. From diving in Belize to the Philippines or Australia, all these dream destinations are looking for scuba diving volunteers to help them protect our oceans.',
            imgUrl: 'https://www.deeperblue.com/wp-content/uploads/2017/06/AdobeStock_50504380.jpeg'
        },
        'humanitarian': {
            title: 'Humanitarian',
            desc: 'Volunteering for humanitarian initiatives abroad is a fantastic way to immerse yourself in a new culture and really learn from the locals. There is no better way to get to know the ins and outs of a country and its culture than working closely with the people who have grown up and been molded by these exotic and fascinating communities abroad',
            imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/CARE_International_%E2%80%93_friendship_and_love.jpg/1200px-CARE_International_%E2%80%93_friendship_and_love.jpg'
        },
        'healthcare': {
            title: 'Healthcare',
            desc: 'Medical volunteer programs abroad are the perfect opportunities to experience the healthcare industry in a developing country. Assist local doctors and nurses with treating those who need it most. Pre-med, medical college or high school students, there are programs available for every level of medical training or experience.',
            imgUrl: 'https://cdn1.internationalmedicalcorps.org/wp-content/uploads/2017/09/Home-tout-storms.jpg'
        },
        'sports': {
            title: 'Sports',
            desc: 'Sports volunteering abroad is the chance to combine your love for sports with traveling the world. Whether you prefer soccer, basketball, rugby or surfing, volunteering is the perfect way to teach your favorite sports to children and pass on your passion to them.',
            imgUrl: 'https://thinkpacific.com/app/uploads/2017/03/9-compressor-1-e1490783754821.jpg'
        },
        'education': {
            title: 'Education',
            desc: 'Education volunteer opportunities are the perfect way to pass on your knowledge to others while learning about a new country, culture, and people at the same time. Whether you are looking to become a teacher, have teaching experience or are looking to get a TEFL certificate, there is the right volunteer program for you.',
            imgUrl: 'https://www.israel21c.org/wp-content/uploads/2019/09/givingway-KAASO.jpg'
        },
        'art': {
            title: 'Art',
            desc: 'Volunteer for art projects and use all your creativity to do something meaningful whilst you travel the world. Whether you play an instrument, are gifted in arts and crafts or have a passion for photography, there are many projects worldwide focusing on these topics.',
            imgUrl: 'https://images.squarespace-cdn.com/content/v1/54ef4d4ee4b002862ddb9057/1447870457225-WPJRPU1KYVP4B1PXXCPR/ke17ZwdGBToddI8pDm48kFLLrz6BVYXLJG30R1ebmBt7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QPOohDIaIeljMHgDF5CVlOqpeNLcJ80NK65_fV7S1UT7hE3reOkk2moavhrBQHsmGfG-n1OUClfcxCZ1rcWKaJ14ubcdsY0uKwK2_j53OFw/image-asset.jpeg?format=1500w'
        },
        'humanRights': {
            title: 'HumanRights',
            desc: 'Volunteer for women\'s empowerment projects and help to give a voice to those who are otherwise unheard. Gender equality is a big topic in the western world and more important than ever. Sometimes we forget that there are countries where women\'s rights are still pretty much non-existent.',
            imgUrl: 'https://www.unv.org/sites/default/files/UNMISS_HumanRightsOfficer_Francesca_2016_cropped_0.jpg'
        },

    }
    return headerObj[filter]


}