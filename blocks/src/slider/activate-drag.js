        /**
         * Drag Snap Functionality
         */
        let isPressed = false
        let cursorX
        
function activateDrag () {
    html.slides.forEach((slide, idx) => {
        slide.addEventListener(eventDown, (e) => {
            // Make slide boundaries based on slide width and static position of slide relative to wrapper
            const slideWidth = slide.clientWidth
            const slideWidthHalf = slideWidth/2
            const initialSlidePosition = slide.getBoundingClientRect().left - html.sliderWrapper.getBoundingClientRect().left
            // console.log('slide.left', slide.getBoundingClientRect().left)
            // console.log('sliderWrapper.left', html.sliderWrapper.getBoundingClientRect().left)
            dragBoundaryMax = initialSlidePosition + slideWidthHalf
            dragBoundaryMin = initialSlidePosition - slideWidthHalf
            isPressed = true
            // console.log('offsetX',e.offsetX)
            // console.log('clientX',e.clientX)
            // console.log('slide.offsetX', getOffsetX(e))
            // console.log('sliderWrapper.offsetleft', html.sliderWrapper.offsetLeft)
            cursorX = getOffsetX(e) - html.sliderWrapper.offsetLeft
            html.sliderWrapper.style.cursor = 'grabbing'
        }, {
            passive: true
        })
    })

    // Moving cursor while holding
    
    html.sliderWrapper.addEventListener(eventMove, (e) => {
        if (!isPressed) return
        e.preventDefault()
        let movedToPosition = getOffsetX(e)
        let translateXAmount = parseFloat(html.sliderTrack.style.transform.replace('translateX(', '').replace('px)', '') || 0)
        console.log('translateXAmount before move:', translateXAmount)
        console.log('initial position of cursorX', cursorX)
        console.log('moved to position', movedToPosition)
        translateXAmount += (movedToPosition - cursorX)
        html.sliderTrack.style.transform = `translateX(${translateXAmount}px)`
        console.log('translateXAmount after move:', html.sliderTrack.style.transform)
        // html.sliderTrack.style.transform = `translateX(${Number(translateXAmount) + (movedToPosition - cursorX)}px)`
        // TODO Fix this for touchscreens
        // console.log('translateXAmount', Number(translateXAmount))
        // console.log('initialPosition', cursorX)
        // console.log('movedToPosition', movedToPosition)
        // html.sliderTrack.style.transform = `translateX(${Number(translateXAmount) + (e.offsetX - cursorX)}px)`
    })

    // Let go of click/cursor
    window.addEventListener(eventUp, () => {
        if (!isPressed) return
        let moveSlide = false
        Array.from(html.slides).some(function(slide, idx) {
            let wrapperPosition = html.sliderWrapper.getBoundingClientRect().left
            let slidePosition = slide.getBoundingClientRect().left - wrapperPosition
            // console.log(idx, '-- wrapperPosition:', wrapperPosition)
            // console.log(idx, '-- slidePosition:', slidePosition)

            if (idx === 0 && slidePosition > dragBoundaryMax) {
                console.log('1st')
                activeIdxSlide = idx
                moveSlide = true
                return true
            }
            if (slideIndexes.length - 1 === idx) {
                console.log('2nd')
                activeIdxSlide = idx
                moveSlide = true
                return true
            }
            if (slidePosition < dragBoundaryMax && slidePosition > dragBoundaryMin) {
                console.log('3rd')
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
    })
    /**/
}