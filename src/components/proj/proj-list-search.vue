<template>
  <div class="proj-list" v-if="projs" >
   <h1>BE THE CHANGE. BE A GLOBAL VOLUNTEER ABROAD.</h1>
   <h2 v-if="noRes">There is no result</h2>
   <ul class="around-the-world-list">
      <li v-for="proj in projs" :key="proj._id" class="list-card" >
        <router-link :to="'/proj/' + proj._id">
          <div class="list-projs-img-conatainer ratio-card">
          <img :src="proj.imgUrls[0]" class="proj-preview-img" >
          <div class = "list-projs-country-details">
          <img :src="`https://www.countryflags.io/${proj.position.short_country}/shiny/64.png`" v-if="proj.position.short_country" class="world-proj-flag">
          <h5 v-if="proj.position.city">{{proj.position.city}},</h5>
          <h5 v-else>{{proj.position.region}},</h5>
          <h5>{{proj.position.country}}</h5>
        </div>
        </div>
        <h5>{{proj.title}}</h5>
        <h6>{{proj.description.substring(0,80) +'...'}}</h6>
        </router-link>
      </li>
    </ul>
  </div>
</template>



<script>
import projPreview from "./proj-preview.vue";

export default {
  name: "projsListSearch",

  data() {
    return {
      projs: null,
      noRes:null
    };
  },
  async created() {
  this.projs = await this.$store.dispatch({ type: "loadProjs" });
  let paramsStr = window.location.href.split('?')[1];
  let searchParams = new URLSearchParams(paramsStr);
  var filteredProjs=null;

   var categoryFilter = searchParams.get('category')
   if(categoryFilter==='all'){
     filteredProjs=this.projs;
   }
   else{
      filteredProjs = this.projs.filter(proj=>{  
       return proj.category === categoryFilter
     })
   }

   var txtFilter = searchParams.get('txt')
   if(!txtFilter){
     filteredProjs=this.projs;
   }
   else{
      filteredProjs = this.projs.filter(proj=>{ 
        if (proj.position.country) {
        return proj.title.toLowerCase().includes(txtFilter.toLowerCase())||
               proj.description.toLowerCase().includes(txtFilter.toLowerCase())  
              || proj.position.country.toLowerCase().includes(txtFilter.toLowerCase())
        }       
         return proj.title.toLowerCase().includes(txtFilter.toLowerCase())||
                proj.description.toLowerCase().includes(txtFilter.toLowerCase())
       // //      || proj.position.city.toLowerCase().includes(txtFilter.toLowerCase())

     })
   }
    var minAgeFilter = +searchParams.get('minAge')
    filteredProjs = this.projs.filter(proj=>{  
       if (proj.requirements.minAge)  return proj.requirements.minAge > minAgeFilter
     })

 if(filteredProjs.length===0){
   this.noRes=true;
 }
 else{
      this.noRes=false;
 }
    this.projs = filteredProjs;
    console.log(this.projs);
    window.scrollTo(0, 0);
  },
    components: {
    projPreview,
  }
};
</script>



<style  >
.proj-list ul{
  display: flex;
  padding: 0;
  flex-wrap: wrap;
  justify-content: center;
}

.proj-list li{
  width: 20%;
  margin: 5px;
  list-style: none;
}
.proj-list li img{
  width:100%;
  margin: 5px;
  list-style: none;
}
 </style>
