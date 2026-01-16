const isInCursorBrowser = navigator.userAgent.includes('Cursor')

export default function App() {
  return (
    <div className="app">
      {/* Onboarding callouts - only show in Cursor browser */}
      {isInCursorBrowser && (
        <div className="onboarding-callouts">
          <div className="callout callout-left">
            <span className="callout-arrow callout-arrow-left"></span>
            <span className="callout-text">Go to your dashboard</span>
          </div>

          <div className="callout callout-center">
            <span className="callout-arrow callout-arrow-center"></span>
            <span className="callout-text">Switch between screen sizes</span>
          </div>

          <div className="callout callout-right">
            <span className="callout-arrow callout-arrow-right"></span>
            <span className="callout-text">Update and share your prototype</span>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="main-content">
        <h1>You're all set</h1>
        <p>Start chatting with agents to build your prototype.</p>
      </div>
    </div>
  )
}