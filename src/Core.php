<?php
/**
 * Core Class.
 *
 * @package splash-blocks
 */

namespace Splash_Blocks;

/**
 * Class Core.
 */
class Core {

	/**
	 * The single instance of the class.
	 *
	 * @var Core
	 */
	protected static $instance = null;

	/**
	 * Ensure only one instance of the class is loaded or can be loaded.
	 *
	 * @return Core - The single instance of the class.
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

    public function init() {
        add_action( 'init', [ $this, 'register_blocks' ], 20 );
    }

    public function register_blocks() {
        register_block_type( 
			SPB_BLOCKS_PATH . '/build/slider',
			array( 
				'render_callback' => function( $attributes, $content ) {
					wp_enqueue_script( 'splash-slider-js' );
					return $content;
				}
			)
		);
        register_block_type( SPB_BLOCKS_PATH . '/build/slide' );

		// require_once SPB_BLOCKS_PATH . '/slider/slider.php';
    }

}
