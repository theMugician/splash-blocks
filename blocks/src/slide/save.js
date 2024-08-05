import { useBlockProps, InnerBlocks } from '@wordpress/block-editor'

export default function Save({ attributes }) {
    const { background } = attributes
    const blockProps = useBlockProps.save({
        className: 'splash-slider__slide',
        style: {
            backgroundColor: background.type === 'color' ? background.color : undefined,
            backgroundImage: background.type === 'image' && background.image?.url ? `url(${background.image.url})` : undefined,
        }
    })

    return (
        <div {...blockProps}>
            <InnerBlocks.Content />
        </div>
    )
}