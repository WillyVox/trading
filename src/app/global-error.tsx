"use client";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en-AU">
      <body>
        <main
          style={{
            maxWidth: 720,
            margin: "80px auto",
            padding: "0 24px",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <h1>Trading Guide is temporarily unavailable</h1>
          <p>We couldn't load the application. Please try again.</p>
          <button
            type="button"
            onClick={reset}
            style={{ padding: "10px 16px", cursor: "pointer" }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
