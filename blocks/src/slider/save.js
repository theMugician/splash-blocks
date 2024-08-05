import { useBlockProps, InnerBlocks } from '@wordpress/block-editor'

export default function Save({ attributes }) {
    const { clientId, dots, arrows, slidesToShow } = attributes
    const options = JSON.stringify({
        slidesPerView: slidesToShow,
        dots: dots,
        arrows: arrows
    })
    const blockProps = useBlockProps.save({
        className: 'splash-slider splash-slider-initialized',
        id: `splash-slider-${clientId}`,
        'data-splash-slider': options
    })

    return (
        <div {...blockProps}>
            <div className='splash-slider__wrapper'>
                <div className='splash-slider__track'>
                    <InnerBlocks.Content />
                </div>
            </div>
            {arrows &&
                <div class="splash-slider__controls">
                    <button class="splash-slider__arrow splash-slider__arrow--prev">
                    </button>
                    <button class="splash-slider__arrow splash-slider__arrow--next">
                    </button>
                </div>
            }
            {dots && <div class="splash-slider__dots"></div>}
        </div>
    )
}