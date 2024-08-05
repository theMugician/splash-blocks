import { useBlockProps, InnerBlocks } from '@wordpress/block-editor'
import { useEffect, useRef, useContext } from '@wordpress/element' // Same as React
import { SlideContext } from '../slider/edit' // Import the context from the parent block

export default function Edit({ attributes, setAttributes, clientId }) {
    const blockProps = useBlockProps({
        className: 'splash-slider__slide'
    })
    const slideRef = useRef()

    const slideContext = useContext(SlideContext)
    console.log('slideContext:', slideContext) // logs: undefined
    const { setSlideRef } = slideContext || {}

    useEffect(() => {
        console.log('slideRef.current:', slideRef.current) // logs correctly
        if (setSlideRef && slideRef.current) {
			console.log('Setting slideRef with clientId:', clientId)

            setSlideRef(slideRef, clientId)
        }
    }, [setSlideRef, clientId])

    return (
        <div {...blockProps} ref={slideRef}>
            // InspectorControls and PanelBody omitted for brevity
            <InnerBlocks />
        </div>
    )
}
