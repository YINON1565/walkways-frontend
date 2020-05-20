<template>
  <section class="main-footer">
    <div class="width-container inside-footer-container flex col a-start j-center">
      <section>
        <router-link to="/">
          <img class="logo" src="../../assets/svg/help.svg" alt="Logo" />
        </router-link>
      </section>
      <div class="content-container-footer flex col bet">
        <div class="flex a-start col bet logo-location-container">
          <img src="../../assets/svg/icon-location.svg" class="img-svg cursor-initial" />
          <p>WalkWays is the world’s leading volunteering platform. We show you how to volunteer abroad! Search & compare the best international volunteer programs offered by volunteer organizations and local NGOs with just a few clicks.</p>
        </div>
        <div class="phone-email-container flex col around">
          <div class="flex a-center not-allowed">
            <img src="../../assets/svg/icon-phone.svg" />
            <p>+1-543-123-4567</p>
          </div>
          <div class="flex a-center">
            <img src="../../assets/svg/icon-email.svg" class="mail-icon" />
            <a href="mailto:walkways@info.com" class="mail-link">walkWays@info.com</a>
          </div>
        </div>
        <ul>
          <li>
            <router-link to="/" class="router-link">Home</router-link>
          </li>
          <li>
            <router-link to="/proj" class="router-link">Publish</router-link>
          </li>
          <li>
            <router-link to="/projs/aroundTheWorld" class="router-link">All Projects</router-link>
          </li>
          <li><span>Blog</span></li>
        </ul>
        <ul>
          <li><span>Contact Us</span></li>
          <li><span>Terms</span></li>
          <li><span>Privacy</span></li>
        </ul>
        <div class="link-svg">
          <img class="img-svg" src="../../assets/svg/facebook.svg" />
          <img class="img-svg" src="../../assets/svg/instegram.svg" />
          <img class="img-svg" src="../../assets/svg/linkdin.svg" />
        </div>
      </div>
    </div>
  </section>
</template>