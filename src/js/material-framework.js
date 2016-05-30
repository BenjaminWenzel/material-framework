import SideNav from "./modules/side-nav";
import DataTable from "./modules/data-table";
import Parallax from "./modules/parallax";

class MaterialFramework {
	init() {
		window.mf = this;
		return Promise.resolve();
	}

	sideNav(e){
		console.log(e);
		const sideNav = new SideNav();
	}
}

$( document ).ready( ()=> {
	const mf = new MaterialFramework();
	mf.init()
		.then( ()=> {console.log( "Material framework loaded!" )}
		);
} );
