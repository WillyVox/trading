"use client";
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en-AU">
      <body>
        <main
          style={{
            maxWidth: 720,
            margin: "80px auto",
            padding: 24,
            fontFamily: "sans-serif",
          }}
        >
          <h1>Trading Guide is temporarily unavailable</h1>
          <p>We couldn't load the application. Please try again.</p>
          <button onClick={() => reset()}>Try again</button>
        </main>
      </body>
    </html>
  );
}
