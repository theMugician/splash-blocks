import React, { useState, useRef, useEffect, createRef } from 'react'
import { useBlockProps, InnerBlocks, useInnerBlocksProps } from '@wordpress/block-editor'
import { createBlock } from '@wordpress/blocks'
import { dispatch, select } from '@wordpress/data'
import { __ } from '@wordpress/i18n'
import './editor.scss'

const ALLOWED_BLOCKS = ['splash-blocks/slide']

export default function Edit({ clientId }) {
    const sliderTrackRef = useRef(null)
    const sliderWrapperRef = useRef(null)
    const slideRefs = useRef([])
    const [trackWidth, setTrackWidth] = useState(0)
    const [trackPosition, setTrackPosition] = useState(0)
    const [activeIndexSlide, setActiveIndexSlide] = useState(0)

    // useEffect(() => {
    //     console.log('Edit component mounted with clientId:', clientId)
    //     if (sliderTrackRef.current) {
    //         const trackChildren = Array.from(sliderTrackRef.current.children)
    //         slideRefs.current = trackChildren.map((_, i) => slideRefs.current[i] || createRef())
    //         const totalWidth = trackChildren.reduce((acc, child) => acc + child.offsetWidth, 0)
    //         setTrackWidth(totalWidth)
    //     }
    // }, [select('core/block-editor').getBlocks(clientId).length])

    // useEffect(() => {
    //     console.log('slideRefs:', slideRefs)
    //     const showSlide = () => {
    //         console.log('showSlide called with activeIndexSlide:', activeIndexSlide)
    //         if (
    //             slideRefs.current[activeIndexSlide] &&
    //             slideRefs.current[activeIndexSlide].current &&
    //             sliderWrapperRef.current &&
    //             sliderTrackRef.current
    //         ) {
    //             const wrapperPosition = sliderWrapperRef.current.getBoundingClientRect().left
    //             const slidePosition = slideRefs.current[activeIndexSlide].current.getBoundingClientRect().left - wrapperPosition
    //             const currentSliderTrackPosition = sliderTrackRef.current.getBoundingClientRect().left - wrapperPosition
    //             setTrackPosition(currentSliderTrackPosition - slidePosition)
    //         }
    //     }
    //     showSlide()
    // }, [activeIndexSlide, slideRefs])

    const slideLeft = () => {
        setActiveIndexSlide((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0))
    }

    const slideRight = () => {
        setActiveIndexSlide((prevIndex) => (prevIndex < slideRefs.current.length - 1 ? prevIndex + 1 : prevIndex))
    }

    // const addNewSlide = () => {
    //     const newBlock = createBlock('splash-blocks/slide', {
    //         background: { type: 'color', color: '#EEEEEE' }
    //     })
    //     const parentBlock = select('core/block-editor').getBlock(clientId)
    //     const slideCount = parentBlock.innerBlocks.length
    //     dispatch('core/block-editor').insertBlock(newBlock, slideCount, clientId)
    //     setTimeout(() => {
    //         slideRefs.current[slideCount] = createRef()
    //         console.log('New slide ref added:', slideRefs.current)
    //     }, 100)
    // }

    const deleteSlide = (slideClientId) => {
        dispatch('core/block-editor').removeBlock(slideClientId)
    }

    const innerBlocksProps = useInnerBlocksProps(
        {
            className: 'splash-slider__track',
            ref: sliderTrackRef
            // style: { width: `${trackWidth}px`, transform: `translateX(${trackPosition}px)` }
        },
        {
            allowedBlocks: ALLOWED_BLOCKS,
            renderAppender: () => (
                <InnerBlocks.ButtonBlockAppender />
            )
        }
    )

    const blockProps = useBlockProps({
        className: 'splash-slider'
    })

    return (
        <div {...blockProps}>
            <div className='splash-slider__wrapper' ref={sliderWrapperRef}>
                {/* <div
                    className='splash-slider__track'
                    ref={sliderTrackRef}
                    style={{ width: `${trackWidth}px`, transform: `translateX(${trackPosition}px)` }}
                > */}
                    <div { ...innerBlocksProps} />
                {/* </div> */}
                {slideRefs && slideRefs.current.length > 1 && (
                {/*  
                <div className='splash-slider__controls'>
                    <button className='splash-slider__arrow splash-slider__arrow--prev' onClick={slideLeft}>
                        Prev
                    </button>
                    <button className='splash-slider__arrow splash-slider__arrow--next' onClick={slideRight}>
                        Next
                    </button>
                </div>
                */}
                )}
                {/* 
                <button className='splash-slider__add-slide' onClick={addNewSlide}>
                    Add Slide
                </button>
                */}
            </div>
        </div>
    )
}
