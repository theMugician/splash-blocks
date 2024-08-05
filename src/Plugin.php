<?php
/**
 * Plugin Class.
 *
 * @package splash-blocks
 */

namespace Splash_Blocks;

/**
 * Class Plugin.
 */
class Plugin {
	/**
	 * The single instance of the class.
	 *
	 * @var Plugin
	 */
	protected static $instance = null;

	/**
	 * Constructor.
	 */
	private function __construct() {
		$this->init();
	}

	/**
	 * Ensure only one instance of the class is loaded or can be loaded.
	 *
	 * @return Plugin - The single instance of the class.
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	public function activate() {}
	public function deactivate() {}

	/**
	 * Initialize plugin
	 */
	private function init() {
		define( 'SPB_PATH', untrailingslashit( plugin_dir_path( __DIR__ ) ) );
		define( 'SPB_URL', untrailingslashit( plugin_dir_url( __DIR__ ) ) );
		define( 'SPB_ASSETS_PATH', SPB_PATH . '/assets' );
		define( 'SPB_ASSETS_URL', SPB_URL . '/assets' );
		define( 'SPB_BLOCKS_PATH', SPB_PATH . '/blocks' );
		define( 'SPB_BLOCKS_URL', SPB_URL . '/blocks' );
		define( 'SPB_VERSION', '1.0.0' );

		new Assets();

		$core = Core::get_instance();
		$core->init();

		// Public functions.
		// require_once SPB_PATH . '/functions.php';
	}
}

