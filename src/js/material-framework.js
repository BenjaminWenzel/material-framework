import { bla } from "./side-nav";

class MaterialFramework {
	init() {
		window.mf = this;
		return Promise.resolve();
	}
}

$( document ).ready( ()=> {
	const mf = new MaterialFramework();
	mf.init()
		.then(
			function() {
				console.log( "Material Framework loaded…" );
				console.log( bla );
			}
		);
} );
