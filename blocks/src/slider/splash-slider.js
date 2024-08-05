(function () {

    // Custom functionality here.
    // Globals can be accessed either through `window.VIDEO_DATA` or simply `VIDEO_DATA`.

    /**
     * IsTouch
     * Check to see if we're using a mobile/touch screen device
     * @param   {NULL}    
     * @returns {boolean}   result
     */
    function IsTouch() {
        let result
        if (navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)) {
            result = true
        } else {
            result = false
        }
        this.result = result
    }

    /**
     * Cursor
     * @see     SplashSlider
     */
    function Cursor(triggerDOM) {
        const isTouch = new IsTouch().result
        if (isTouch) return

        const cursor = document.querySelector('.cursor')
        let visible = false
        const positionElement = (e)=> {
            const mouseY = e.clientY
            const mouseX = e.clientX
            cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        }

        if (typeof triggerDOM === 'undefined') {
            triggerDOM = window
        }

        triggerDOM.addEventListener('mouseover', (e) => {
            visible = true
            positionElement(e)
            cursor.classList.add('is-active')
        })

        triggerDOM.addEventListener('mousemove', (e) => {
            if (visible) {
                positionElement(e)
            }
        })

        triggerDOM.addEventListener('mouseout', (e) => {
            visible = false
            cursor.classList.remove('is-active')
        })

        triggerDOM.addEventListener('mousedown', (e) => {
            cursor.classList.add('is-grabbing')
        })

        triggerDOM.addEventListener('mouseup', (e) => {
            cursor.classList.remove('is-grabbing')
        })
    }

    /**
     * SplashSlider
     * @author  Greg Slonina
     * @param   {string}    sliderId - html class or id
     * @param   {Object}    customOptions - custom options to override the defaults
     * @param   {boolean}   customOptions.infiniteScroll
     * @param   {boolean}   customOptions.offset
     * @param   {boolean}   customOptions.cursor
     * @param   {Object}    customOptions.breakpointOffsets - only used when {customOptions.offset} is true
     * @returns {NULL}      
     */
    function SplashSlider (sliderId, customOptions = {}) {
        let html = {
            slider: document.querySelector(`${sliderId}`),
            sliderWrapper: document.querySelector(`${sliderId} .splash-slider__wrapper`),
            sliderTrack: document.querySelector(`${sliderId} .splash-slider__track`),
            initialSlides: document.querySelectorAll(`${sliderId} .splash-slider__slide`),
            slides: document.querySelectorAll(`${sliderId} .splash-slider__slide`),
            prev: document.querySelector(`${sliderId} .splash-slider__arrow--prev`),
            next: document.querySelector(`${sliderId} .splash-slider__arrow--next`),
            dotsContainer: document.querySelector(`${sliderId} .splash-slider__dots`),
            dots: ''
        }

        /**
         * Default options
         */
        let options = {
            infiniteScroll: false,
            offset: false,
            cursor: false,
            breakpointOffsets: {
                6000: 100,
                1400: 50,
                768: 20
            },
            slideWidth: false,
            slidesPerView: 1
        }

        if (customOptions !== null && Object.keys(customOptions).length > 0) {
            for (const option in customOptions) {
                options[option] = customOptions[option]
            }
        }

        let sliderWidth = html.slider.clientWidth
        let wrapperWidth = html.sliderWrapper.clientWidth
        let slideIndexes = []
        let trackWidth = 0
        let position = 'left'
        let activeIdxSlide = 0
        let dragBoundaryMax
        let dragBoundaryMin
        let currentOffset = 0
        let isTouch = false
        let eventDown = 'mousedown'
        let eventMove = 'mousemove'
        let eventUp = 'mouseup'

        // Initiate Cursor
        if (options.cursor) {
            const sliderCursor = new Cursor(html.sliderWrapper)
        }

        function throttle (func, limit) {
            let lastFunc
            let lastRan
            return function (...args) {
                const context = this
                if (!lastRan) {
                    func.apply(context, args)
                    lastRan = Date.now()
                } else {
                    clearTimeout(lastFunc)
                    lastFunc = setTimeout(function () {
                        if ((Date.now() - lastRan) >= limit) {
                            func.apply(context, args)
                            lastRan = Date.now()
                        }
                    }, limit - (Date.now() - lastRan))
                }
            }
        }

        // updateIsTouch
        function updateIsTouch () {
            isTouch = new IsTouch().result
        }

        // updateTouchEvents
        function updateTouchEvents () {
            if (isTouch) {
                eventDown = 'touchstart'
                eventMove = 'touchmove'
                eventUp = 'touchend'
            }
        }

        /**
         * getOffsetX
         * @param   {Object}    e - event
         * @returns {number}    result
         */
        let getOffsetX = (e) => {
            let result
            if (isTouch) {
                let rect = e.target.getBoundingClientRect()
                result = e.touches[0].clientX - rect.left
            } else {
                result = e.offsetX
            }
            return Math.round(result)
        }

        function getSliderWidth () {
            if (sliderWidth !== html.slider.clientWidth) {
                sliderWidth = html.slider.clientWidth
            }
        }

        /**
         * Offset slider based on breakpoints
         */
        function updateOffset () {
            if (options.offset) {
                let foundBreakpoint = false
                for (const breakpoint in options.breakpointOffsets) {
                    if (document.body.clientWidth < Number(breakpoint) && !foundBreakpoint) {
                        currentOffset = Number(options.breakpointOffsets[breakpoint])
                        foundBreakpoint = true
                    }
                }
            }
        }

        function resetTranslateX () {
            html.sliderTrack.style.transform = `translateX(0px)`
        }

        function updateSlides () {
            if (options.infiniteScroll) {
                wrapperWidth = html.sliderWrapper.clientWidth

                // Calculate how many slides are viewable per wrapper
                options.slidesPerView = Math.ceil(wrapperWidth/html.initialSlides[0].clientWidth)

                // Reset - Remove all JS clone slides
                html.slides.forEach((slide, idx) => {
                    if (slide.classList.contains('js-clone')) {
                        slide.remove()
                    }
                })

                // Create cloned slides and append/prepend them to the slider track
                for (let i = 0; i < options.slidesPerView; i++) {
                    let firstSlide = html.initialSlides[i],
                    lastSlide = html.initialSlides[html.initialSlides.length - (1 + i)],
                    cloneFirst = firstSlide.cloneNode(true),
                    cloneLast = lastSlide.cloneNode(true)
                    cloneFirst.classList.add(`js-clone`)
                    cloneLast.classList.add(`js-clone`)
                    cloneFirst.dataset.index = options.slidesPerView + i
                    cloneLast.dataset.index = options.slidesPerView + (html.initialSlides.length - 1) - i

                    // Clone first and last slide
                    html.sliderTrack.appendChild(cloneFirst)
                    html.sliderTrack.prepend(cloneLast)
                }

                html.slides = document.querySelectorAll(`${sliderId} .splash-slider__slide`)
                activeIdxSlide = options.slidesPerView
            }
        }

        function updateSlideIndexes () {
            /*
            4 slides
            2 perView
            0: {0,1}, 1: {1,2}, 2: {2,3}
            */
            let done = false
            slideIndexes = []
            html.slides.forEach((slide, idx) => {
                if (!done && (idx + options.slidesPerView - 1) < html.slides.length) {
                    slideIndexes.push(idx)
                } else {
                    done = true
                }
            })
        }

        // Make width size for each slide based on size of slider
        // If there is a fixed css width it will not create new slider size
        function createSlideWidth () {
            if (!options.slideWidth) {
                html.slides.forEach((slide, idx) => {
                    // console.log(sliderWidth)
                    // slide.style.width = `${sliderWidth/options.slidesPerView}px`
                    slide.style.flexBasis = `${sliderWidth / options.slidesPerView}px`
                })
            }
        }

        // Make width size of Track
        function createTrackWidth () {
            // Reset trackWidth
            trackWidth = 0
            html.slides.forEach((slide, idx) => {
                trackWidth += slide.clientWidth
            })
        }

        function createDots () {
            // Populate dots if dot container exists
            if (html.dotsContainer !== null) {
                // Reset - Remove all dots
                html.dotsContainer.innerHTML = ''
                slideIndexes.forEach((slide, idx) => {
                    // Refactor this 
                    if (slide.classList && slide.classList.contains('js-clone')) {
                        // Do nothing
                    } else {
                        let dot = document.createElement('div')
                        dot.classList.add('splash-slider__dot')
                        dot.dataset.index = idx
                        if (idx === activeIdxSlide) {
                            dot.classList.add('is-active')
                        }
                        html.dotsContainer.appendChild(dot)
                    }
                })
            }

            html.dots = document.querySelectorAll(`${sliderId} .splash-slider__dot`)
        }

        /**
         * Update Dots
         * @returns {NULL}  
         */
        function updateDots () {
            const activeDot = html.dotsContainer.querySelector('.is-active')
            if (activeDot !== null) {
                activeDot.classList.remove('is-active')
            }
            html.dots.forEach((dot, idx) => {
                if (Number(activeIdxSlide) === Number(dot.dataset.index)) {
                    dot.classList.add('is-active')
                }
            })
        }

        function activateDots () {
            html.dots.forEach((dot, idx) => {
                dot.addEventListener('click', (e) => {
                    activeIdxSlide = dot.dataset.index
                    showSlide()
                })
            })
        }

        /**
         * Drag Snap Functionality
         */
        let isPressed = false
        let cursorX

        function handleEventDown(e) {
            const slide = e.currentTarget
            // Calculate slide boundaries based on slide width and static position of slide relative to wrapper
            const slideWidth = slide.clientWidth
            const slideWidthHalf = slideWidth / 2
            const initialSlidePosition = slide.getBoundingClientRect().left - html.sliderWrapper.getBoundingClientRect().left
            dragBoundaryMax = initialSlidePosition + slideWidthHalf
            dragBoundaryMin = initialSlidePosition - slideWidthHalf
            isPressed = true
            cursorX = getOffsetX(e) - html.sliderWrapper.offsetLeft
            html.sliderWrapper.style.cursor = 'grabbing'
        }
    
        function handleEventMove(e) {
            if (!isPressed) return
            e.preventDefault()
            const movedToPosition = getOffsetX(e)
            let translateXAmount = parseFloat(html.sliderTrack.style.transform.replace('translateX(', '').replace('px)', '') || 0)
    
            translateXAmount += (movedToPosition - cursorX)
            html.sliderTrack.style.transform = `translateX(${translateXAmount}px)`
        }
    
        function handleEventUp() {
            if (!isPressed) return
            let moveSlide = false
    
            Array.from(html.slides).some((slide, idx) => {
                const wrapperPosition = html.sliderWrapper.getBoundingClientRect().left
                const slidePosition = slide.getBoundingClientRect().left - wrapperPosition
    
                if (idx === 0 && slidePosition > dragBoundaryMax) {
                    activeIdxSlide = idx
                    moveSlide = true
                    return true
                }
                if (slideIndexes.length - 1 === idx) {
                    activeIdxSlide = idx
                    moveSlide = true
                    return true
                }
                if (slidePosition < dragBoundaryMax && slidePosition > dragBoundaryMin) {
                    activeIdxSlide = idx
                    moveSlide = true
                    return true
                }
            })
    
            if (moveSlide) {
                showSlide()
            }
    
            isPressed = false
            html.sliderWrapper.style.cursor = 'grab'
        }
    
        function addEventListeners() {
            html.slides.forEach((slide, idx) => {
                slide.addEventListener(eventDown, handleEventDown, { passive: true })
            })
            html.sliderWrapper.addEventListener(eventMove, handleEventMove)
            window.addEventListener(eventUp, handleEventUp)
        }
    
        function removeEventListeners() {
            html.slides.forEach((slide, idx) => {
                slide.removeEventListener(eventDown, handleEventDown)
            })
            html.sliderWrapper.removeEventListener(eventMove, handleEventMove)
            window.removeEventListener(eventUp, handleEventUp)
        }
    
        function activateDrag () {
            addEventListeners()
    
            // Handle window resize
            window.addEventListener('resize', () => {
                removeEventListeners()
                addEventListeners()
            })
        }

        /**
         * Show Slide
         */
        function showSlide (transition = true) {
            if (position === 'center') {

            }

            if (html.dotsContainer !== null) {
                updateDots(activeIdxSlide)
            }

            // If you land on a cloned slide add no class 'shifting' so slide appears and doesn't transition
            if (transition) {
                html.sliderTrack.classList.add('shifting')
            }

            const wrapperPosition = html.sliderWrapper.getBoundingClientRect().left
            const slidePosition = html.slides[activeIdxSlide].getBoundingClientRect().left - wrapperPosition
            const currentSliderTrackPosition = html.sliderTrack.getBoundingClientRect().left - wrapperPosition

            let newPosition = currentSliderTrackPosition - slidePosition
            // Offset size of the track
            if (options.offset) {
                //Check current offsetWidth
                newPosition = newPosition + currentOffset
            }

            // Center slide on infiniteScroll
            if (options.infiniteScroll) {
                newPosition += wrapperWidth/2 - html.slides[activeIdxSlide].clientWidth/2
            }
            let lastActiveSlide = document.querySelector(`${sliderId} .splash-slider__slide.is-active`)
            if (lastActiveSlide !== null) {
                lastActiveSlide.classList.remove('is-active')
            }
            html.slides[activeIdxSlide].classList.add('is-active')

            html.sliderTrack.style.transform = `translateX(${newPosition}px)`

            setTimeout(() => {
                html.sliderTrack.classList.remove('shifting')
            }, 350)
            if (options.infiniteScroll) {
                checkIndex()
            }
        }

        /**
         * Check index
         */
        function checkIndex () {
            setTimeout(() => {
                if (html.slides[activeIdxSlide].classList.contains('js-clone')) {
                    activeIdxSlide = html.slides[activeIdxSlide].dataset.index
                    showSlide(false)
                }
            }, 360)
        }

        /**
         * Previous and Next buttons
         */
        function slideLeft() {
            const previousIdxSlide = activeIdxSlide
            activeIdxSlide--

            if (activeIdxSlide < 0) {
                activeIdxSlide = options.infiniteScroll ? slideIndexes.length - 1 : 0
            }

            if (activeIdxSlide !== previousIdxSlide) {
                showSlide()
            }
        }

        function slideRight() {
            const previousIdxSlide = activeIdxSlide
            activeIdxSlide++

            if (activeIdxSlide > slideIndexes.length - 1) {
                activeIdxSlide = options.infiniteScroll ? 0 : slideIndexes.length - 1
            }

            if (activeIdxSlide !== previousIdxSlide) {
                showSlide()
            }
        }

        if (html.prev !== null) {
            html.prev.addEventListener('click', slideLeft)
        }
        if (html.next !== null) {
            html.next.addEventListener('click', slideRight)
        }

        function init() {
            updateIsTouch()
            updateTouchEvents()
            activateDrag()
            updateOffset()
            updateSlideIndexes()
            createSlideWidth()
            updateSlides()
            createTrackWidth()
            createDots()
            activateDots()
            resetTranslateX()
            html.sliderTrack.style.width = trackWidth + 'px'
            if (options.infiniteScroll) {
                showSlide(false)
            }
            if (options.offset) {
                html.sliderTrack.style.transform = `translateX(${currentOffset}px)`;
            }
        }

        function reset() {
            // Reset - Remove all JS clone slides
            html.slides.forEach((slide, idx) => {
                if (slide.classList.contains('js-clone')) {
                    slide.remove()
                }
            })
            html.dotsContainer.innerHTML = ''
        }

        init()
        // window.addEventListener('resize', init)
        // Resize only when slider width changes
        window.addEventListener('resize', function () {
            const prevSliderWidth = sliderWidth
            if (prevSliderWidth !== html.slider.clientWidth) {
                sliderWidth = html.slider.clientWidth
                init()
            }
        })
    }

    let splashSliders = document.querySelectorAll('.splash-slider-initialized')
    splashSliders.forEach((slider, idx) => {
        sliderOptions = JSON.parse(slider.getAttribute('data-splash-slider'))
        slider = new SplashSlider(`#${slider.id}`, sliderOptions)
    })
    // let companySlider = new SplashSlider('.company-slider', { offset: true })
    // let ourGallerySlider = new SplashSlider('.our-gallery-slider', { infiniteScroll: true })
    // let servicesSlider = new SplashSlider('.services-slider', { offset: true })
    // let fullwidthSlider = new SplashSlider('.fullwidth-slider')
    // let quoteSlider = new SplashSlider('.quote-slider', { infiniteScroll: true })

}())
