export default function Header() {
  return (
    <header>
      <aside className="hero-copy">
        <div data-collapse="medium" data-animation="default" data-duration="400" role="banner" className="nav w-nav">
          <div className="nav-inner">

            <div className="nav-menu-wrap w-clearfix">
              <aside role="navigation" className="nav-menu-2 w-nav-menu">
                <a href="story-generator.html" id="beta" className="nav-link w-nav-link">Beta</a>
                <a href="#features" className="nav-link w-nav-link">Features</a>
                <a href="creative-cache.html" id="creative-cache" className="nav-link w-nav-link">Creative Cache</a>
                <a id="signInButton" href="#how-to-use" className="nav-link w-nav-link">Sign-in</a>
                <a id="signOutButton" href="#how-to-use" className="nav-link w-nav-link">Sign-out</a>
                <a id="signOutButton" href="#how-to-use" className="nav-link w-nav-link">
                  <strong id="userName">userName</strong>
                </a>
                <a id="signOutButton" href="#how-to-use" className="nav-link w-nav-link" />
                <img src="https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg" loading="lazy" width="52" id="userProfilePic" alt="" className="image-7" />
              </aside>
              <div className="menu-button w-nav-button">
                <div className="menu-icon w-icon-nav-menu" />
              </div>
            </div>
          </div>
        </div>
      </aside>
    </header>
  );
}