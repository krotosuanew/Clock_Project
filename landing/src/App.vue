<template >
  <div>
    <header id="main-header" class="main-header">
      <div class="logo">
          <div class="logo__circle-logo ">
            <div class="logo__circle-logo middle-line">
              <div class="logo__circle-logo last-line"> </div></div>
          </div>
          <div class="logo__name"><span class="logo__name-company">CLOCKWISE</span><br/>Software</div>
        </div>
      <div class="menu">
        <div class="menu__item">
          Benefits
        </div >
        <div class="menu__item">
          Advantages
        </div>
        <div class="menu__item">
          Achievements
        </div>
      </div>
      <div class="lang-switcher">
        <span class="lang-switcher__item" @click="changeLanguage('DE')"  v-bind:class="{ active: language === 'DE' }">DE</span>
        <span class="lang-switcher__item"  @click="changeLanguage('EN')" v-bind:class="{ active: language === 'EN' }">EN</span>
      </div>
      <div @click="openMenu" v-bind:class="{ open: burgerOpen }" class="burger">
        <span class="burger__icon"></span>
      </div>
      <div class="burger__menu" v-bind:class="{ open: burgerOpen }">
        <div class="burger__menu-item">Benefits</div>
        <div class="burger__menu-item">Advantages</div>
        <div class="burger__menu-item">Achievements</div>
        <div class="burger__menu-item">Imprint and Data protection</div>
        <div class="burger__menu-item"></div>
        <div class="burger__menu-item language-menu ">
          <div>
            Language
          </div>
          <div class="lang-switcher">
            <span class="lang-switcher__item" @click="changeLanguage('DE')"  v-bind:class="{ active: language === 'DE' }">DE</span>
            <span class="lang-switcher__item"  @click="changeLanguage('EN')" v-bind:class="{ active: language === 'EN' }">EN</span>
          </div>
        </div>
        <button class="button-blue menu-button" @click="openModalDiscuss"> Request  a free consultation</button>
      </div>
    </header>
    <main class="content">
      <div class="content__decorative-top" ></div>
      <div class="scroll" @click="scroll" href="#">  <span class="scroll__text"><img class="scroll__arrow" src="./assets/scroll-down-arrow@3x.png"> Scroll for more information</span></div>
      <div class="logistics">
        <div class="logistics__info">
          <span class="logistics__management">LOGISTICS MANAGEMENT SOFTWARE DEVELOPMENT</span>
          <span class="logistics__transportation">We solve transportation and stock management problems for Factories, Manufacturers, Carriers, Resellers, E-commerce and even more. Any issue can be solved with smart digitalization. </span>
          <button class="button-blue logistics__button" @click="openModalDiscuss">Request a free consultation</button>
        </div>
      </div>
      <div class="content__decor-right"></div>
      <h1 id="experienced"  class="experienced">Have you experienced any of these issues?</h1>
      <div class="carousel">
        <VueSlickCarousel :vertical="false" :adaptiveHeight="true"  :centerMode= "true"  :infinite="false" :variableWidth="true"  :slidesToShow="1" :arrows="true" :dots="true">
          <div class="slide">
            <div class="slide__header">
              Overwhelming and
              inaccurate paperwork </div>
            <div class="slide__main">
              Most documents, such as orders, invoices, contracts, etc. are stored in folders on endless shelves. They are never easy to find. Moreover, due to human factor, crucial mistakes take place that cost your company much time to solve, but also drain your budget.
            </div>
          </div>
          <div class="slide">
            <div class="slide__header">
              Manual order management
              based on phone calls and emails
            </div>
            <div class="slide__main">
              Do your clients call you just to find out that the necessary product is currently out of stock? You waste resources by not providing them with actual information about your available inventory online            </div>
          </div>
          <div class="slide">
            <div class="slide__header">
              Inefficient truck load </div>
            <div class="slide__main">
              Without dynamic truck load scheduling, your company misses up to 50% of the potential loading capability            </div>
          </div>
        </VueSlickCarousel>
      </div>
      <div id="expenses" class="expenses">
        <p class="expenses__reduction">Expenses reduction after implementing logistics management software!</p>
        <p class="expenses__percent">49,2%</p>
      </div>
      <div  class="benefit">
        <p id="benefit"  class="benefit__software">HOW CAN YOU BENEFIT FROM
          CUSTOM LOGISTICS SOFTWARE?</p>
        <p class="benefit__software benefit__software-mobile">LOGISTICS MANAGEMENT
          SOFTWARE DEVELOPMENT</p>
        <div class="benefit-list">
          <div class="benefit-list__component">
          <div class="benefit-list__circle">
            1
          </div>
          <div class="benefit-list__text-block">
            <p class="benefit-list__header">
              Customized to your needs
            </p>
            <p class="benefit-list__text">A software is developed exclusively with your needs and plans in mind. This enables to solve unique problems efficiently</p>
          </div>
          </div>
          <div class="benefit-list__component">
          <div class="benefit-list__circle">
            2
          </div>
          <div class="benefit-list__text-block ">
            <p class="benefit-list__header">
              Short-term ROI
            </p>
            <p class="benefit-list__text">You will experience the first returns right in the first month after integrating the system in your current processes</p>
          </div>
            </div>
          <div class=" benefit-list__component last-component">
          <div class="benefit-list__circle ">
            3
          </div>
          <div class="benefit-list__text-block">
            <p class="benefit-list__header">
              Predictable scalability
            </p>
            <p class="benefit-list__text">A custom system grows along with your business since your company goals are taken into account in the development process</p>
          </div>
            </div>
          <div class="benefit-list__component">
          <div class="benefit-list__circle">
            4
          </div>
          <div class="benefit-list__text-block">
            <p class="benefit-list__header">
              Improve, not rebuild
            </p>
            <p class="benefit-list__text">Custom software supports and improves your running processes step-by-step. Your current system keeps working  </p>
          </div>
          </div>
        </div>
      </div>
      <div class="contacts">
        <p class="contacts__text">
          YOUR BUSINESS CASE <br/>
          IS COMPLETELY DIFFERENT?
          <span class="contacts__text_color">
            LET’S DISCUSS
          </span>
        </p>
        <button @click="openModalDiscuss" id="advantages" class="button-blue">
          Fill in the contact form
        </button >
      </div>
      <div id="advantages-comments" class="advantages-comments ">
        <div  class="advantages">
          <p class="advantages__header"> OUR ADVANTAGES</p>
          <ul class = "advantages-list">
            <li class = "advantages-list__header" @click="accordion">System Integration <span class = "advantages-list__arrow" @click="$event.target.classList.toggle('active')"></span></li>
            <p class = "advantages-list__text"  >We help you with educating employees and integrating software in your running processes</p>
            <li class = "advantages-list__header" @click="accordion">Technical support <span class = "advantages-list__arrow" @click="$event.target.classList.toggle('active')"></span></li>
            <p class = "advantages-list__text" >We guarantee support and product maintenance after release and keep improving the system in cooperation with your team</p>
            <li class = "advantages-list__header" @click="accordion">Data security <span class = "advantages-list__arrow" @click="$event.target.classList.toggle('active')"></span></li>
            <p class = "advantages-list__text" >Your data is stored on secure servers based in Germany (or any other country on your request)</p>
            <li class = "advantages-list__header" @click="accordion">We speak your language  <span class = "advantages-list__arrow" @click="$event.target.classList.toggle('active')"></span></li>
            <p class = "advantages-list__text" >Our managers are German- and English-speaking, so the business communication is clear and easy</p>
            <li class = "advantages-list__header" @click="accordion">Representative in Germany <span class = "advantages-list__arrow" @click="$event.target.classList.toggle('active')"></span></li>
            <p class = "advantages-list__text" >Our business analyst is based in Frankfurt am Main. Discussing all the business issues in person is much more efficient</p>
            <li class = "advantages-list__header" @click="accordion">5 years experience in logistics <span class = "advantages-list__arrow" @click="$event.target.classList.toggle('active')"></span></li>
            <p class = "advantages-list__text" >Our business analyst is based in Frankfurt am Main. Discussing all the business issues in person is much more efficient</p>
          </ul>
        </div>
        <div class="comments">
          <p class="comments__text">Flawless communication with the Clockwise Software team resulted in a fleet management system that exactly met the needs of the municipal waste transportation company. The software runs on Android smartphones, so there was no need for expensive equipment, and the learning curve was low. We’ve implemented multi-tenancy to use this software in other projects connected with logistics.</p>
          <div class="comments__person">
            <span >
              <span class="comments__name">
                Dan Weber
              </span><br>
                      CEO/CTO at Marketsoup
            </span>
            <div class="comments__avatar "></div>
          </div>
          <p class="comments__text"> With the automatic load scheduling and proper route planning, we are finally able to use 100% of our truck load capacity. Also, order management and delivery have become much more efficient due to custom modules. In the first year, we have covered our investment in custom ERP system development</p>
          <div class="comments__person ">
            <span>
              <span class="comments__name">Vadim Chabanenko</span><br>
              Director at UDK Gazbeton
            </span>
            <div class="comments__avatar avatar-2"></div>
          </div>
        </div>
      </div>
      <div id="partners" class="partners">
        <p class="partners__header">WHAT OUR PARTNERS HAVE ACHIEVED
          WITH CUSTOM TRANSPORT MANAGEMENT
          SOFTWARE</p>
      <div class="partners-content">
        <div class=" partners-slider">
         <VueSlickCarousel :slidesToShow="1" :infinite="false"   :arrows="true" :dots="true">
          <div class="partners-slider__slide first-slide"></div>
          <div class="partners-slider__slide second-slide"></div>
          <div class="partners-slider__slide next-slide"></div>
        </VueSlickCarousel>
         <p class="partners-slider__text">double truck day load capacity increase </p>
       </div>
        <div class="partners-system">
                    <p class="partners-system__header">ERP system for construction materials factory</p>
                    <p class="partners-system__text">Custom logistics software includes several modules that enabled to fully digitalize a factory
                     <br/> – Order and stock management optimization
                      <br/>  – Automatic invoicing and accounting
                      <br/>  – Delivery scheduling and route planning
                      <br/>  – Automatic contractors selection<br/>
                      <br/>  Eliminating manual work enabled the factory to double truck day load capacity (an increase from 45 to 92 trucks per day) and save over 60.000 EUR in the first year. </p>
                  </div>
      </div>
      </div>
      <div id="discuss" class="discuss-project">
        <p class="Discuss-project__text">
          Discuss your project with the professionals
        </p>
        <button @click="openModalDiscuss" class="button-blue ">Let`s discuss</button>
      </div>
      <div class="content__decor-left"></div>
    </main>
      <footer class="main-footer">
        <div class="footer-content">
          <div class="footer-content__text" >Data Protection / Imprint</div>
          <div class="logo-footer">
            <div class="logo-footer__circle-logo">
              <div class="logo-footer__circle-logo middle">
                <div class="logo-footer__circle-logo last"> </div></div>
            </div>
            <p class="logo-footer__text"><span class="logo-footer__header">CLOCKWISE</span><br/>Software</p>
          </div>
        </div>
      </footer>
    <div id="Modal" class="modal-form" @click="close" v-bind:class="{ active: openModal }">
    <div class="modal-content" @click.stop>
      <p class="modal-content__topic">LET’S DISCUSS <br/>
        YOUR BUSINESS CASE!</p>
      <span class="modal-content__close" @click="close"></span>
      <p class="modal-content__info">
        Everything is possible! <span class="modal-content__info-desktop"> We will analyze your existing situation, discover the bottlenecks and offer a solution that exactly matches your business case!</span>
      </p>
      <div class="modal-name">
        <div class="Input">
          <span class="Input__label">First name</span>
          <input class="Input__aria">
        </div>
      <div class="Input">
        <span class="Input__label">Last name</span>
        <input class="Input__aria">
      </div>
      </div>
      <div class="modal-email" >
      <div class="Input">
        <span class="Input__label">E-Mail</span>
        <input class="Input__aria">
      </div>
      </div>
      <div class="modal-comment">
        <span class="modal-comment__label">Some brief description or comments</span>
         <textarea class="modal-comment__aria" rows="4" cols="50">
      </textarea>
      </div>
      <p class="modal-content__pressing">
        By pressing the “request a consultation” button you agree with <a class="modal-content__link" href="#">  data protection</a> policy
      </p>
      <button @click="sent" class="button-blue modal-button" v-bind:class="{ success: buttonSent }"> <span class="button-blue__text">Request a Consultation</span> <span class="button-blue__text_success">Your request was successfully sent</span> </button>

    </div>

  </div>
  </div>
</template>

<script>
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'

export default {
  name: 'MyComponent',
  components: { VueSlickCarousel },
  data () {
    return {
      language: 'EN',
      burgerOpen: false,
      openModal: false,
      buttonSent: false
    }
  },
  methods: {
    scroll () {
      const height = document.getElementById('main-header').clientHeight + 1
      if (document.getElementById('experienced').getBoundingClientRect().top > height) {
        document.getElementById('experienced').scrollIntoView()
        window.scrollBy(0, -document.getElementById('main-header').clientHeight)
      } else if (document.getElementById('benefit').getBoundingClientRect().top > height + 44) {
        document.getElementById('benefit').scrollIntoView()
        if (document.body.clientWidth >= 1440) {
          window.scrollBy(0, -document.getElementById('main-header').clientHeight - 44)
        } else {
          window.scrollBy(0, -document.getElementById('main-header').clientHeight)
        }
      } else if (document.getElementById('advantages-comments').getBoundingClientRect().top > height) {
        document.getElementById('advantages-comments').scrollIntoView()
        window.scrollBy(0, -document.getElementById('main-header').clientHeight)
      } else if (document.getElementById('partners').getBoundingClientRect().top > height) {
        document.getElementById('partners').scrollIntoView()
        window.scrollBy(0, -document.getElementById('main-header').clientHeight)
      } else if (document.getElementById('discuss').getBoundingClientRect().top > height) {
        document.getElementById('discuss').scrollIntoView()
        window.scrollBy(0, -document.getElementById('main-header').clientHeight)
      }
    },
    changeLanguage (lang) {
      this.language = lang
    },
    lockBody () {
      if (this.burgerOpen || this.openModal) {
        document.body.style.marginRight = `${window.innerWidth - document.body.clientWidth}px`
        document.body.classList.add('lock')
      } else {
        document.body.classList.remove('lock')
        document.body.style.marginRight = '0px'
      }
    },
    openMenu () {
      this.burgerOpen = !this.burgerOpen
      this.lockBody()
    },
    close (e) {
      this.openModal = false
      this.buttonSent = false
      this.lockBody()
    },
    openModalDiscuss (event) {
      event.stopPropagation()
      this.openModal = true
      this.lockBody()
    },
    accordion (e) {
      e.currentTarget.nextElementSibling.classList.toggle('active')
      e.currentTarget.children[0].classList.toggle('active')
    },
    sent () {
      this.buttonSent = true
    }
  }
}
</script>
<style lang="scss">
@import "assets/styles";

</style>
