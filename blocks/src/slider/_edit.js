import React, { createContext, useRef } from 'react'
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor'

export const SlideContext = createContext()

export default function Edit() {
    const slideRefs = useRef([])

    const setSlideRef = (ref, index) => {
        slideRefs.current[index] = ref
		console.log('setSlideRef called with ref:', ref, 'and index:', index)
    }

    // code omitted for brevity

	console.log('Rendering Slider component with context value:', { setSlideRef })

    const blockProps = useBlockProps()

    return (
        <SlideContext.Provider value={{ setSlideRef }}>
            <div {...blockProps}>
                <div className='splash-slider__wrapper'>
                    <div
                        className='splash-slider__track'
                    >
                        <InnerBlocks
                            allowedBlocks={['splash-blocks/slide']}
                            renderAppender={() => <InnerBlocks.ButtonBlockAppender />}
                            templateLock={false}
                        />
                    </div>
                </div>
            </div>
        </SlideContext.Provider>
    )
}
