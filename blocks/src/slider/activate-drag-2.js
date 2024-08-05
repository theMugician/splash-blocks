function activateDrag () {
    html.slides.forEach((slide, idx) => {
        slide.addEventListener(eventDown, (e) => {
            // Calculate slide boundaries based on slide width and static position of slide relative to wrapper
            const slideWidth = slide.clientWidth
            const slideWidthHalf = slideWidth / 2
            const initialSlidePosition = slide.getBoundingClientRect().left - html.sliderWrapper.getBoundingClientRect().left
            dragBoundaryMax = initialSlidePosition + slideWidthHalf
            dragBoundaryMin = initialSlidePosition - slideWidthHalf
            isPressed = true
            cursorX = getOffsetX(e) - html.sliderWrapper.offsetLeft
            html.sliderWrapper.style.cursor = 'grabbing'
        }, { passive: true })
    })

    // Moving cursor while holding
    html.sliderWrapper.addEventListener(eventMove, (e) => {
        if (!isPressed) return
        e.preventDefault()
        const movedToPosition = getOffsetX(e)
        let translateXAmount = parseFloat(html.sliderTrack.style.transform.replace('translateX(', '').replace('px)', '') || 0)

        translateXAmount += (movedToPosition - cursorX)
        html.sliderTrack.style.transform = `translateX(${translateXAmount}px)`
        // cursorX = movedToPosition // Update cursorX to the new position
    })

    // Let go of click/cursor
    window.addEventListener(eventUp, () => {
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
    })
}