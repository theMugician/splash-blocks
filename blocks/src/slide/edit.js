import { __ } from '@wordpress/i18n'
import { useBlockProps, InspectorControls, InnerBlocks, MediaUpload, MediaUploadCheck, ColorPalette } from '@wordpress/block-editor'
import { PanelBody, SelectControl, Button } from '@wordpress/components'

const ALLOWED_BLOCKS = ['core/paragraph', 'core/heading', 'core/button']
const TEMPLATE = [
    ['core/paragraph', { placeholder: 'Add a description...' }]
]

export default function Edit({ attributes, setAttributes, clientId }) {
    const { background } = attributes
    const blockProps = useBlockProps({
        className: 'splash-slider__slide'
    })

    const onChangeBackgroundType = (value) => {
        setAttributes({ background: { ...background, type: value } })
    }

    const onChangeBackgroundColor = (color) => {
        setAttributes({ background: { ...background, color } })
    }

    const onSelectImage = (media) => {
        setAttributes({ background: { ...background, image: { url: media.url, id: media.id, alt: media.alt } } })
    }

    return (
        <div {...blockProps} style={{
            backgroundColor: background.type === 'color' ? background.color : undefined,
            backgroundImage: background.type === 'image' && background.image?.url ? `url(${background.image.url})` : undefined,
        }}>
            <InspectorControls>
                {/* */}
                <PanelBody title={__('Background Settings', 'slide')} initialOpen={true}>
                    
                    <SelectControl
                        label={__('Background Type', 'slide')}
                        value={background.type}
                        options={[
                            { label: __('Color', 'slide'), value: 'color' },
                            { label: __('Image', 'slide'), value: 'image' }
                        ]}
                        onChange={onChangeBackgroundType}
                    />
                    {background.type === 'color' ? (
                        <ColorPalette
                            value={background.color}
                            onChange={onChangeBackgroundColor}
                        />
                    ) : (
                        <>
                            <MediaUploadCheck>
                                <MediaUpload
                                    onSelect={onSelectImage}
                                    allowedTypes={['image']}
                                    render={({ open }) => (
                                        <Button onClick={open}>
                                            {__('Select Image', 'slide')}
                                        </Button>
                                    )}
                                />
                            </MediaUploadCheck>
                        </>
                    )}
                </PanelBody>
            </InspectorControls>
            <InnerBlocks allowedBlocks={ALLOWED_BLOCKS} template={TEMPLATE} />
        </div>
    )
}
