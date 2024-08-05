<?php
/**
 * Assets Class.
 *
 * @package splash-blocks
 */

namespace Splash_Blocks;

/**
 * Class Assets.
 */
class Assets {

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->init();
	}

	/**
	 * Initialize.
	 */
	private function init() {
		/**
		 * The 'enqueue_block_assets' hook includes styles and scripts both in editor and frontend,
		 * except when is_admin() is used to include them conditionally
		 */
		add_action( 'wp_enqueue_scripts', [ $this, 'register_splash_slider' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'admin_enqueue_styles' ] );
	}

	/**
	 * Enqueue Admin Scripts
	 */
	public function admin_enqueue_styles() {

		/*
		$asset_config_file = sprintf( '%s/assets.php', SPB_BUILD_PATH );

		if ( ! file_exists( $asset_config_file ) ) {
			return;
		}

		$asset_config = include_once $asset_config_file;

		if ( empty( $asset_config['js/editor.js'] ) ) {
			return;
		}

		$editor_asset    = $asset_config['js/editor.js'];
		$js_dependencies = ( ! empty( $editor_asset['dependencies'] ) ) ? $editor_asset['dependencies'] : [];
		$version         = ( ! empty( $editor_asset['version'] ) ) ? $editor_asset['version'] : filemtime( $asset_config_file );
		*/

		// Admin CSS.
		wp_enqueue_style(
			'smb-admin-css',
			SPB_ASSETS_URL . '/css/admin.css',
			array(),
			filemtime( SPB_ASSETS_PATH . '/css/admin.css' ),
			'all'
		);

		// Theme Gutenberg blocks CSS.
		/*
		$css_dependencies = [
			'wp-block-library-theme',
			'wp-block-library',
		];

		wp_enqueue_style(
			'af-blocks-css',
			SPB_BUILD_URL . '/css/editor.css',
			$css_dependencies,
			filemtime( SPB_BUILD_PATH . '/css/editor.css' ),
			'all'
		);
		*/
	}

	public function register_splash_slider() {
		wp_register_script(
			'splash-slider-js',
			SPB_BLOCKS_URL . '/src/slider/splash-slider.js',
			array(),
			null,
			true
		);
	}
}
