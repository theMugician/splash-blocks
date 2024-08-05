import React, { useEffect } from 'react'
import { useBlockProps, InnerBlocks, useInnerBlocksProps, InspectorControls } from '@wordpress/block-editor'
import { PanelBody, ToggleControl, RangeControl } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import './editor.scss'

const ALLOWED_BLOCKS = ['splash-blocks/slide']

export default function Edit({ clientId, attributes, setAttributes }) {
    const { clientId: storedClientId, dots, arrows, slidesToShow } = attributes

    const slideStyle = `
        .splash-slider .splash-slider__slide {
            flex-basis: ${100 / slidesToShow}%;
        }
    `

    useEffect(() => {
        if (!storedClientId) {
            setAttributes({ clientId })
        }
    }, [clientId, storedClientId])

    // useEffect(() => {

    // }, [slidesToShow])

    const blockProps = useBlockProps({
        className: 'splash-slider'
    })

    return (
        <div {...blockProps}>
            <InspectorControls>
                {/* */}
                <PanelBody title={__('Slider Settings', 'splash-blocks')} initialOpen={true}>
                    <RangeControl
                        label={__('Number of Slides to Show', 'splash-blocks')}
                        value={slidesToShow}
                        onChange={(value) => setAttributes({ slidesToShow: value })}
                        min={1}
                        max={10}
                    />
                    <ToggleControl
                        label="Show Dots"
                        checked={dots}
                        onChange={(value) => setAttributes({ dots: value })}
                    />
                    <ToggleControl
                        label="Show Prev/Next Arrows"
                        checked={arrows}
                        onChange={(value) => setAttributes({ arrows: value })}
                    />
                </PanelBody>
            </InspectorControls>
            <InnerBlocks
                allowedBlocks={ALLOWED_BLOCKS}
                renderAppender={ InnerBlocks.ButtonBlockAppender}
            />
            <style>{slideStyle}</style>
        </div>
    )
}
