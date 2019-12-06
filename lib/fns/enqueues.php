<?php

namespace NCCAgent\enqueues;

function enqueue_scripts(){
  wp_register_script( 'datatables', '//cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js', ['jquery'], '1.10.19', true );
  //wp_register_style( 'datatables', '//cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css', null, '1.10.19' );

  wp_register_script( 'select2', 'https://cdn.jsdelivr.net/npm/select2@4.0.12/dist/js/select2.min.js', ['jquery'], '4.0.12' );
  //wp_register_style( 'select2', 'https://cdn.jsdelivr.net/npm/select2@4.0.12/dist/css/select2.min.css' );

  wp_register_script( 'plan-finder', plugin_dir_url( __FILE__ ) . '../js/plan-finder.js', ['datatables','select2'], filemtime( plugin_dir_path( __FILE__ ). '../js/plan-finder.js' ), true );

  wp_enqueue_script( 'dropdown-side-menu', plugin_dir_url( __FILE__ ) . '../js/menu.js', ['jquery'], filemtime( plugin_dir_path( __FILE__ ) . '../js/menu.js' ), true );

  //wp_enqueue_style( 'google-fonts', '//fonts.googleapis.com/css?family=Fira+Sans:700,700i&Roboto&display=swap' ); 'google-fonts',
  wp_enqueue_style( 'nccagent-styles', plugin_dir_url( __FILE__ ) . '../' . NCC_CSS_DIR . '/main.css', ['hello-elementor','elementor-frontend'], filemtime( plugin_dir_path( __FILE__ ) . '../' . NCC_CSS_DIR . '/main.css' ) );
}
add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\\enqueue_scripts' );