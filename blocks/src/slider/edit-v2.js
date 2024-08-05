import React, { useState, useRef, useEffect, createRef } from 'react'
import { useBlockProps, InnerBlocks, useInnerBlocksProps, InspectorControls } from '@wordpress/block-editor'
import { PanelBody, ToggleControl } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import './editor.scss'

const ALLOWED_BLOCKS = ['splash-blocks/slide']

export default function Edit({ clientId, attributes, setAttributes }) {
    const { clientId: storedClientId, dots, arrows } = attributes

    useEffect(() => {
        if (!storedClientId) {
            setAttributes({ clientId })
        }
    }, [clientId, storedClientId])

    const sliderTrackRef = useRef(null)
    const sliderWrapperRef = useRef(null)

    const innerBlocksProps = useInnerBlocksProps(
        {
            className: 'splash-slider__track',
            ref: sliderTrackRef
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
            <InspectorControls>
                {/* */}
                <PanelBody title={__('Slider Settings', 'slider')} initialOpen={true}>
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
            {/* <div className='splash-slider__wrapper' ref={sliderWrapperRef}>
                <div { ...innerBlocksProps} />
            </div> */}
            <InnerBlocks
                renderAppender={ InnerBlocks.ButtonBlockAppender }
            />
        </div>
    )
}
